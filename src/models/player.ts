import { firestoreUtils } from "@/lib/firestore-utils";
import { db } from "@/lib/firebase";
import { OperationResult } from "@/models/operation-result";

export interface Player {
    id: string;
    name: string;
    email?: string;
    avatarUrl?: string;
    totalScore: number; // Lower is better in UNO
    gamesPlayed: number;
    gamesWon: number;
    createdAt: Date;
    updatedAt: Date;
}

const playerCollection = firestoreUtils<Player>(db, "players");

/**
 * Subscribe to all players in real-time
 */
export const subscribeToPlayers = (callback: (players: Player[]) => void) => {
    return playerCollection.onSnapshotAll((players) => {
        callback(players);
    });
};

/**
 * Create a new player
 */
export const createPlayer = async (
    playerData: Omit<
        Player,
        "id" | "createdAt" | "updatedAt" | "totalScore" | "gamesPlayed" | "gamesWon"
    >
): Promise<OperationResult<Player>> => {
    try {
        const newPlayer: Player = {
            id: crypto.randomUUID(),
            totalScore: 0,
            gamesPlayed: 0,
            gamesWon: 0,
            ...playerData,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        await playerCollection.create(newPlayer);
        return { success: true, data: newPlayer };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
        };
    }
};

/**
 * Get all players (one-time fetch)
 */
export const getAllPlayers = async (): Promise<OperationResult<Player[]>> => {
    try {
        const players = await playerCollection.getAll();
        return { success: true, data: players };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
        };
    }
};

/**
 * Get a single player by ID
 */
export const getPlayer = async (
    playerId: string
): Promise<OperationResult<Player>> => {
    try {
        const player = await playerCollection.getById(playerId);
        return player
            ? { success: true, data: player }
            : { success: false, error: "Player not found" };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
        };
    }
};

/**
 * Update player data
 */
export const updatePlayer = async (
    playerId: string,
    playerData: Partial<Omit<Player, "id" | "createdAt" | "updatedAt">>
): Promise<OperationResult<Player>> => {
    try {
        const player = await playerCollection.update(playerId, {
            ...playerData,
            updatedAt: new Date(),
        });
        return player
            ? { success: true, data: player }
            : { success: false, error: "Player not found" };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
        };
    }
};

/**
 * Delete a player
 */
export const deletePlayer = async (
    playerId: string
): Promise<OperationResult<void>> => {
    try {
        await playerCollection.remove(playerId);
        return { success: true };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
        };
    }
};
