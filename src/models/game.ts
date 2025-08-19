import {firestoreUtils} from "@/lib/firebase/firestore-utils";
import {db} from "@/lib/firebase/firebase";
import {OperationResult} from "@/models/operation-result";
import {getPlayer, updatePlayer} from "@/models/player";
import {where} from "firebase/firestore";

export interface GameRound {
    roundNumber: number;
    scores: { [playerId: string]: number }; // { playerId: score }
}

export interface Game {
    id: string;
    players: string[]; // player.ts IDs
    rounds: GameRound[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const gameCollection = firestoreUtils<Game>(db, "games");

/**
 * Subscribe to the most recently active game in real-time
 */
export const subscribeToActiveGame = (
    callback: (game: Game | null) => void
) => {
    return gameCollection.onSnapshotQuery(
        [where("isActive", "==", true)],
        (games) => {
            if (games.length === 0) {
                callback(null);
                return;
            }
            const latestGame = games.sort(
                (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
            )[0];
            callback(latestGame);
        }
    );
};

/**
 * Create a new game with selected players
 */
export const createGame = async (
    playerIds: string[]
): Promise<OperationResult<Game>> => {
    try {
        const newGame: Game = {
            id: crypto.randomUUID(),
            players: playerIds,
            rounds: [],
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        await gameCollection.create(newGame);
        return {success: true, data: newGame};
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
        };
    }
};

/**
 * Add a round to an existing game
 */
export const addRoundToGame = async (
    gameId: string,
    scores: { [playerId: string]: number }
): Promise<OperationResult<Game>> => {
    try {
        const game = await gameCollection.getById(gameId);
        if (!game) return {success: false, error: "Game not found"};

        const newRound: GameRound = {
            roundNumber: game.rounds.length + 1,
            scores,
        };

        const updatedGame: Game = {
            ...game,
            rounds: [...game.rounds, newRound],
            updatedAt: new Date(),
        };

        await gameCollection.update(gameId, updatedGame);
        return {success: true, data: updatedGame};
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
        };
    }
};

/**
 * End the game and update player.ts totals
 */
export const endGameAndSetPlayerTotals = async (
    gameId: string
): Promise<OperationResult<Game>> => {
    try {
        const game = await gameCollection.getById(gameId);
        if (!game) return {success: false, error: "Game not found"};

        // Calculate total points for each player.ts
        const totals: Record<string, number> = {};
        for (const round of game.rounds) {
            for (const playerId of Object.keys(round.scores)) {
                totals[playerId] =
                    (totals[playerId] || 0) + round.scores[playerId];
            }
        }
        // Update player.ts stats
        for (const playerId of game.players) {
            const totalScoreToAdd = totals[playerId] || 0;

            // Get existing stats (adjust to your DB/API)
            const playerResult = await getPlayer(playerId);
            if (!playerResult.success || !playerResult.data) {
                continue;
            }
            const existingStats = playerResult.data;

            await updatePlayer(playerId, {
                totalScore: (existingStats.totalScore || 0) + totalScoreToAdd,
                gamesPlayed: (existingStats.gamesPlayed || 0) + 1,
            });
        }


        // Mark game as inactive
        const updatedGame: Game = {
            ...game,
            isActive: false,
            updatedAt: new Date(),
        };

        await gameCollection.update(gameId, updatedGame);

        return {success: true, data: updatedGame};
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
        };
    }
};

/**
 * One-time fetch for a game
 */
export const getGame = async (
    gameId: string
): Promise<OperationResult<Game>> => {
    try {
        const game = await gameCollection.getById(gameId);
        return game
            ? {success: true, data: game}
            : {success: false, error: "Game not found"};
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
        };
    }
};

/**
 * One-time fetch for a game
 */
export const getGames = async (): Promise<OperationResult<Game[]>> => {
    try {
        const games = await gameCollection.getAll({ field: "updatedAt", direction: "desc" });
        return games
            ? {success: true, data: games}
            : {success: true, data: []};
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
        };
    }
};

/**
 * Delete a game
 */
export const deleteGame = async (
    gameId: string
): Promise<OperationResult<void>> => {
    try {
        await gameCollection.remove(gameId);
        return {success: true};
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
        };
    }
};
