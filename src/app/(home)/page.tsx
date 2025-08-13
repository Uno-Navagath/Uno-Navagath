// app/page.tsx
'use client';
import React, { useState } from 'react';
import Header from './_components/Header';
import Leaderboard from './_components/Leaderboard';
import AddPlayerCard from './_components/AddPlayerCard';
import CreateGameDialog from './_components/CreateGameDialog';
import ActiveGameCard from './_components/ActiveGameCard';
import { usePlayers, useActiveGame } from '@/lib/hooks';

export default function HomePage() {
    const { players, loading } = usePlayers();
    const { activeGame, createGame, addRound, endGame } = useActiveGame();

    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
    const [roundInputs, setRoundInputs] = useState<Record<string,string>>({});
    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="inline-flex flex-col items-center gap-2">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <div className="text-sm text-muted-foreground">Loading game data...</div>
            </div>
        </div>
    );
    const handleCreateGame = async () => {
        if (selectedPlayers.length < 2) return alert('Select at least 2 players');
        const res = await createGame(selectedPlayers);
        if (!res.success) alert(res.error ?? 'Failed to create');
        else {
            setDialogOpen(false);
            setSelectedPlayers([]);
        }
    };

    const handleAddRound = async () => {
        if (!activeGame) return alert('No active game');
        const scores: Record<string, number> = {};
        for (const pid of activeGame.players) {
            scores[pid] = Number(roundInputs[pid] ?? 0) || 0;
        }
        const res = await addRound(activeGame.id, scores);
        if (!res.success) alert(res.error ?? 'Failed to add round');
        else setRoundInputs({});
    };

    const handleEndGame = async () => {
        if (!activeGame) return alert('No active game');
        const res = await endGame(activeGame.id);
        if (!res.success) alert(res.error ?? 'Failed to end game');
    };

    return (
        <div className="min-h-screen bg-background text-foreground p-4 max-w-md mx-auto">
            <Header />

            <Leaderboard players={players} />

            {activeGame ? (
                <ActiveGameCard
                    activeGame={activeGame}
                    players={players}
                    roundInputs={roundInputs}
                    setRoundInputs={setRoundInputs}
                    onAddRound={handleAddRound}
                    onEndGame={handleEndGame}
                />
            ) : (
                <>
                    <AddPlayerCard />
                    <CreateGameDialog
                        players={players}
                        selected={selectedPlayers}
                        setSelected={setSelectedPlayers}
                        open={dialogOpen}
                        setOpen={setDialogOpen}
                        onCreate={handleCreateGame}
                    />
                </>
            )}
            <div className="h-28" />
        </div>
    );
}
