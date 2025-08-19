'use server'
import database from "@/database";
import {gamePlayers, games, players, rounds, scores} from "@/database/schema";
import {desc, eq, sql} from "drizzle-orm";
import {redirect} from "next/navigation";
import {revalidatePath} from "next/cache";


export async function getRecentGames(limit = 3) {
    return database
        .select({
            gameId: games.id,
            status: games.status,
            createdAt: games.createdAt,
            playerId: players.id,
            playerName: players.name,
            playerAvatar: players.avatarUrl,
            totalScore: sql<number>`COALESCE(SUM(
            ${scores.score}
            ),
            0
            )`,
            avgScore: sql<number>`COALESCE(AVG(
            ${scores.score}
            ),
            0
            )`,
        })
        .from(games)
        .innerJoin(gamePlayers, eq(gamePlayers.gameId, games.id))
        .innerJoin(players, eq(players.id, gamePlayers.playerId))
        .leftJoin(scores, eq(scores.playerId, players.id))
        .groupBy(games.id, players.id)
        .orderBy(desc(games.createdAt))
        .limit(limit);
}


export async function createGame({
                                     hostId,
                                     playerIds,
                                 }: {
    hostId: string;
    playerIds: string[];
}) {
    if (!hostId || playerIds.length === 0) {
        throw new Error("Host and at least one player.ts required");
    }

    // Create game
    const [game] = await database
        .insert(games)
        .values({hostId})
        .returning();

    // Add players to join table
    await database.insert(gamePlayers).values(
        playerIds.map((pid) => ({
            gameId: game.id,
            playerId: pid,
            isHost: pid === hostId ? 1 : 0,
        }))
    );

    redirect(`/game/${game.id}`);
}

export async function getPlayerGames() {
    return database
        .select({
            id: games.id,
            status: games.status,
            createdAt: games.createdAt,
            hostName: players.name,
            hostAvatar: players.avatarUrl,
            playerCount: sql<number>`COUNT(
            ${gamePlayers.id}
            )`,
            currentRound: sql<number | null>`MAX(
            ${rounds.roundNumber}
            )`,
        })
        .from(games)
        .leftJoin(players, eq(games.hostId, players.id))
        .leftJoin(gamePlayers, eq(gamePlayers.gameId, games.id))
        .leftJoin(rounds, eq(rounds.gameId, games.id))
        .groupBy(games.id, players.id)
        .orderBy(desc(games.createdAt))
}


export async function getGameDetails(gameId: string) {
    return await database.query.games.findFirst({
        where: eq(games.id, gameId),
        with: {
            players: {
                with: {player: true}
            },
            rounds: {
                with: {scores: {with: {player: true}}}
            }
        }
    });
}

export async function addRoundScores(
    gameId: string,
    scoresData: { playerId: string; score: number }[]
) {
    if (!gameId) throw new Error("gameId is required");

    // Get last round number
    const [lastRound] = await database
        .select({roundNumber: rounds.roundNumber})
        .from(rounds)
        .where(eq(rounds.gameId, gameId))
        .orderBy(desc(rounds.roundNumber))
        .limit(1);

    const nextRoundNumber = lastRound ? lastRound.roundNumber + 1 : 1;

    // Insert round
    const [round] = await database
        .insert(rounds)
        .values({
            gameId,
            roundNumber: nextRoundNumber,
        })
        .returning();

    // Insert scores for each player.ts
    await database.insert(scores).values(
        scoresData.map((s) => ({
            roundId: round.id,
            playerId: s.playerId,
            score: s.score,
        }))
    );

    revalidatePath(`/game/${gameId}`);

    return round;
}

export async function endGame(gameId: string) {
    await database.update(games).set({status: "finished"}).where(eq(games.id, gameId));
    redirect(`/`);
}

export async function discardGame(gameId: string) {
    await database.delete(games).where(eq(games.id, gameId));
    revalidatePath(`/`);
}
export async function addPlayer(gameId: string, playerId: string) {
    // Insert player into the game
    await database.insert(gamePlayers).values({
        gameId,
        playerId,
        isHost: 0
    });

    // Fetch all rounds for this game
    const allRounds = await database.select().from(rounds).where(eq(rounds.gameId, gameId));

    if (allRounds.length) {
        // Compute average score per round
        const roundAverages = await Promise.all(
            allRounds.map(async (r) => {
                const avgResult = await database
                    .select({ avg: sql<number>`AVG(${scores.score})` })
                    .from(scores)
                    .where(eq(scores.roundId, r.id));
                return { roundId: r.id, avg: avgResult[0].avg || 0 };
            })
        );

        // Backfill new player's scores with round averages
        await database.insert(scores).values(
            roundAverages.map((r) => ({
                roundId: r.roundId,
                playerId,
                score: r.avg
            }))
        );
    }

    revalidatePath(`/game/${gameId}`);
}

export async function removePlayer(gameId: string, playerId: string) {
    // delete all scores
    await database
        .delete(scores)
        .where(sql`${scores.playerId}
        =
        ${playerId}
        AND
        ${scores.roundId}
        IN
        (
        SELECT
        id
        FROM
        ${rounds}
        WHERE
        ${rounds.gameId}
        =
        ${gameId}
        )`);

    await database.delete(gamePlayers).where(sql`${gamePlayers.gameId}
    =
    ${gameId}
    AND
    ${gamePlayers.playerId}
    =
    ${playerId}`);
    revalidatePath(`/game/${gameId}`);
}
