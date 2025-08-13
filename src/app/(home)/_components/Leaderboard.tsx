// components/Leaderboard.tsx
'use client';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Player } from '@/models/player';

type Props = { players: Player[] };

export default function Leaderboard({ players }: Props) {
    const sorted = players.slice().sort((a,b) => a.totalScore - b.totalScore);
    return (
        <Card className="mb-4">
            <CardHeader>
                <CardTitle>Leaderboard</CardTitle>
            </CardHeader>
            <CardContent>
                {sorted.length === 0 ? (
                    <div className="text-sm text-muted-foreground">No players yet — add friends to start.</div>
                ) : (
                    <ul className="space-y-2">
                        {sorted.map((p, i) => (
                            <li key={p.id} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-sm font-semibold">
                                        {p.name.slice(0,1).toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="font-medium">{p.name}</div>
                                        <div className="text-xs text-muted-foreground">{p.gamesPlayed} games</div>
                                    </div>
                                </div>
                                <div className="text-lg font-bold">{p.totalScore}</div>
                            </li>
                        ))}
                    </ul>
                )}
            </CardContent>
        </Card>
    );
}
