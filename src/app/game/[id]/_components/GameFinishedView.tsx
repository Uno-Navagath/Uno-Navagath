"use client";

import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";


export default function GameFinishedView({ game }: { game: any }) {
    const winner = game.players.reduce(
        (prev: any, curr: any) =>
            curr.totalScore > prev.totalScore ? curr : prev,
        game.players[0]
    );

    const chartData = game.players.map((gp: any) => ({
        name: gp.player.name,
        score: gp.totalScore,
        avg: gp.averageScore,
    }));

    return (
        <div className="space-y-6">
            {/* Winner */}
            <Card className="p-6 text-center">
                <h2 className="text-xl font-bold mb-2">🏆 Winner</h2>
                <Avatar className="h-16 w-16 mx-auto mb-2">
                    {winner.player.avatarUrl ? (
                        <AvatarImage src={winner.player.avatarUrl} />
                    ) : (
                        <AvatarFallback>
                            {winner.player.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                    )}
                </Avatar>
                <p className="text-lg font-semibold">{winner.player.name}</p>
                <p className="text-muted-foreground">
                    Total Score: {winner.totalScore}
                </p>
            </Card>

            {/* Player Stats */}
            <Card className="p-4 space-y-2">
                <h2 className="font-bold">Player Statistics</h2>
                <div className="grid gap-2">
                    {game.players.map((gp: any) => (
                        <div
                            key={gp.player.id}
                            className="flex justify-between items-center border-b py-2"
                        >
                            <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                    {gp.player.avatarUrl ? (
                                        <AvatarImage src={gp.player.avatarUrl} />
                                    ) : (
                                        <AvatarFallback>
                                            {gp.player.name.slice(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                    )}
                                </Avatar>
                                <span>{gp.player.name}</span>
                            </div>
                            <div className="flex gap-6 text-sm">
                                <span>Total: {gp.totalScore}</span>
                                <span>Avg: {gp.averageScore}</span>
                                <span>Wins: {gp.roundsWon}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Score Chart */}
            <Card className="p-4">
                <h2 className="font-bold mb-4">Score Comparison</h2>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="score" fill="#8884d8" />
                            <Bar dataKey="avg" fill="#82ca9d" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            {/* Round History */}
            <Card className="p-4 space-y-2">
                <h2 className="font-bold">Round History</h2>
                <div className="space-y-2">
                    {game.rounds.map((r: any, idx: number) => (
                        <div key={r.id} className="border p-2 rounded">
                            <p className="font-semibold">Round {idx + 1}</p>
                            <div className="flex flex-wrap gap-4 text-sm mt-1">
                                {r.scores.map((s: any) => (
                                    <span key={s.id}>
                    {s.player.name}: {s.score}
                  </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
}
