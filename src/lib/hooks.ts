// lib/hooks.ts
'use client';
import { useEffect, useState, useCallback } from 'react';
import { Player, subscribeToPlayers as subPlayers } from '@/models/player';
import { Game, subscribeToActiveGame as subActiveGame, createGame as createGameModel, addRoundToGame as addRoundModel, endGameAndSetPlayerTotals as endGameModel } from '@/models/game';

export function usePlayers() {
    const [players, setPlayers] = useState<Player[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const unsub = subPlayers((list: Player[]) => {
            setPlayers(list);
            setLoading(false);
        });
        return () => unsub && unsub();
    }, []);


    return { players, loading };
}

export function useActiveGame() {
    const [activeGame, setActiveGame] = useState<Game | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const unsub = subActiveGame((g: Game | null) => {
            setActiveGame(g);
            setLoading(false);
        });
        return () => unsub && unsub();
    }, []);

    const createGame = useCallback(async (playerIds: string[]) => {
        return await createGameModel(playerIds);
    }, []);

    const addRound = useCallback(async (gameId: string, scores: Record<string, number>) => {
        return await addRoundModel(gameId, scores);
    }, []);

    const endGame = useCallback(async (gameId: string) => {
        return await endGameModel(gameId);
    }, []);

    return { activeGame, loading, createGame, addRound, endGame };
}
