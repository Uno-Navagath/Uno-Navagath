"use client";

import {useState} from "react";
import {Button} from "@/components/ui/button";
import {Card} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {addRoundScores, discardGame, endGame, removePlayer,} from "@/lib/database/actions/game";
import {GamePlayers, Games, Rounds, Scores} from "@/database/schema";
import {AddPlayersButton} from "@/app/game/[id]/_components/AddPlayersButton";
import {PlayerScoreRow} from "@/app/game/[id]/_components/PlayerScoreRow";

interface GameActiveViewProps {
    game: Games & {
        players: (GamePlayers & { player: { id: string; name: string; avatarUrl?: string } })[];
        rounds: (Rounds & { scores: (Scores & { player: { id: string; name: string } })[] })[];
    };
}

export default function GameActiveView({game}: GameActiveViewProps) {
    const [scores, setScores] = useState<Record<string, number>>({});

    const handleScoreChange = (playerId: string, value: string) => {
        setScores((prev) => ({...prev, [playerId]: Number(value) || 0}));
    };

    const handleSubmitScores = async () => {
        const payload = Object.entries(scores).map(([playerId, score]) => ({
            playerId,
            score,
        }));
        await addRoundScores(game.id, payload);
        setScores({});
    };

    const getTotalScore = (playerId: string) =>
        game.rounds.reduce(
            (sum, round) =>
                sum + (round.scores.find((s) => s.playerId === playerId)?.score || 0),
            0
        );

    const getAverageScore = (playerId: string) => {
        const totalRounds = game.rounds.length;
        return totalRounds ? getTotalScore(playerId) / totalRounds : 0;
    };

    return (
        <div className="space-y-6">
            {/* Players & Score Entry */}
            <Card className="p-4 space-y-4">
                <h2 className="font-bold">Enter Scores</h2>
                <div className="grid gap-4">
                    {game.players.map((gp) => (
                        <PlayerScoreRow
                            key={gp.player.id}
                            id={gp.player.id}
                            name={gp.player.name}
                            avatarUrl={gp.player.avatarUrl}
                            isHost={!!gp.isHost}
                            totalScore={getTotalScore(gp.player.id)}
                            avgScore={getAverageScore(gp.player.id)}
                            value={scores[gp.player.id] ?? ""}
                            onChange={(v) => setScores((prev) => ({ ...prev, [gp.player.id]: v }))}
                            onRemove={() => removePlayer(game.id, gp.player.id)}
                        />
                    ))}
                </div>
                <Button onClick={handleSubmitScores}>Submit Round</Button>
            </Card>

            {/* Rounds Summary */}
            {game.rounds.length > 0 && (
                <Card className="p-4 space-y-2">
                    <h2 className="font-bold">Rounds</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full table-auto border-collapse border">
                            <thead>
                            <tr className="bg-gray-800">
                                <th className="border px-2 py-1">Round</th>
                                {game.players.map((gp) => (
                                    <th key={gp.player.id} className="border px-2 py-1">
                                        {gp.player.name}
                                    </th>
                                ))}
                            </tr>
                            </thead>
                            <tbody>
                            {game.rounds.map((round) => (
                                <tr key={round.id}>
                                    <td className="border px-2 py-1">{round.roundNumber}</td>
                                    {game.players.map((gp) => {
                                        const score = round.scores.find(
                                            (s) => s.playerId === gp.player.id
                                        )?.score;
                                        return (
                                            <td key={gp.player.id} className="border px-2 py-1 text-center">
                                                {score ?? "-"}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            )}

            {/* Game Actions */}
            <Card className="p-4 flex gap-4">
                <Button variant="default" onClick={() => endGame(game.id)}>
                    End Game
                </Button>
                <Button variant="destructive" onClick={() => discardGame(game.id)}>
                    Discard Game
                </Button>
            </Card>

            <Card className="p-4 space-y-2">
                <h2 className="font-bold">Add Player</h2>
                <AddPlayersButton gameId={game.id}/>
            </Card>
        </div>
    );
}
