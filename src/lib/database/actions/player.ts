'use server'
import database from "@/database";
import {gamePlayers, games, players, rounds, scores} from "@/database/schema";
import {avg, count, eq, sql, sum} from "drizzle-orm";
import {createClient} from "@/lib/supabase/server";


export const getTopPlayers = async () => {
    console.log('Getting top players');
    return database
        .select({
            id: players.id,
            name: players.name,
            avatarUrl: players.avatarUrl,
            // total rounds (games played)
            gamesPlayed: sql<number>`COUNT(DISTINCT
            ${scores.roundId}
            )`,

            // total score
            score: sql<number>`COALESCE(SUM(
            ${scores.score}
            ),
            0
            )`,

            // average score
            averageScore: sql<number>`COALESCE(AVG(
            ${scores.score}
            ),
            0
            )`,

            // wins (rounds won)
            wins: sql<number>`SUM(CASE WHEN
            ${rounds.winnerId}
            =
            ${players.id}
            THEN
            1
            ELSE
            0
            END
            )`,

            // streak (harder: requires window functions; placeholder for now)
            streak: sql<number>`0`,
        })
        .from(players)
        .leftJoin(scores, eq(players.id, scores.playerId))
        .leftJoin(rounds, eq(rounds.id, scores.roundId))
        .groupBy(players.id, players.name)
        .orderBy(sql`AVG(
        ${scores.score}
        )
        ASC`)
        .limit(10);
}


export async function getPlayerAnalytics() {
    const supabase = await createClient();
    const {data: {user}, error} = await supabase.auth.getUser();

    if (error || !user) throw new Error("No authenticated user");

    // find player.ts
    const [player] = await database
        .select()
        .from(players)
        .where(eq(players.userId, user.id));

    if (!player) throw new Error("Player not found");

    // games played
    const [gameStats] = await database
        .select({
            totalGames: count(gamePlayers.gameId),
        })
        .from(gamePlayers)
        .where(eq(gamePlayers.playerId, player.id));

    // rounds & scores
    const [roundStats] = await database
        .select({
            totalRounds: count(scores.roundId),
            totalScore: sum(scores.score),
            averageScore: avg(scores.score),
        })
        .from(scores)
        .where(eq(scores.playerId, player.id));

    // wins
    const [winsStats] = await database
        .select({
            wins: count(games.id),
        })
        .from(games)
        .where(eq(games.winnerId, player.id));

    // weekly performance
    const weekly = await database
        .select({
            weekday: sql<number>`CAST(EXTRACT(DOW FROM
            ${rounds.createdAt}
            )
            AS
            int
            )`,
            total: sum(scores.score).mapWith(Number),
        })
        .from(scores)
        .innerJoin(rounds, eq(scores.roundId, rounds.id))
        .where(eq(scores.playerId, player.id))
        .groupBy(sql`CAST(EXTRACT(DOW FROM
        ${rounds.createdAt}
        )
        AS
        int
        )`);

    const weeklyScores = Array(7).fill(0);
    for (const row of weekly) {
        const idx = (row.weekday + 6) % 7; // convert Sunday=0 → 6
        weeklyScores[idx] = row.total ?? 0;
    }

    return {
        player,
        analytics: {
            totalGames: (gameStats.totalGames ?? 0) as number,
            totalRounds: (roundStats.totalRounds ?? 0) as number,
            totalScore: (roundStats.totalScore ?? 0) as number,
            averageScore: (roundStats.averageScore ?? 0) as number,
            winRate:
                (gameStats.totalGames > 0
                    ? winsStats.wins / gameStats.totalGames
                    : 0) as number,
            weeklyScores,
        },
    };
}


export async function getPlayers() {
    return database.select().from(players);
}