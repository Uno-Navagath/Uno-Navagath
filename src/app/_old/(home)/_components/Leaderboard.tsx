// components/Leaderboard.tsx
'use client';
import React from 'react';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Player} from '@/models/player';

type Props = {
    players: Player[],
    onPlayerClick?: (player: Player) => void;
};
export default function Leaderboard({ players, onPlayerClick }: Props) {
    const sorted = players
        .slice()
        .sort((a, b) => {
            // Push zero-games players to bottom
            if (a.gamesPlayed === 0 && b.gamesPlayed > 0) return 1;
            if (b.gamesPlayed === 0 && a.gamesPlayed > 0) return -1;

            // Then sort by totalScore (lower is better)
            if (a.totalScore !== b.totalScore) {
                return a.totalScore - b.totalScore;
            }

            // Finally, sort by gamesPlayed (more is better)
            return b.gamesPlayed - a.gamesPlayed;
        });

    return (
        <Card className="mb-4">
            <CardHeader>
                <CardTitle>Leaderboard</CardTitle>
            </CardHeader>
            <CardContent>
                {sorted.length === 0 ? (
                    <div className="text-sm text-muted-foreground">
                        No players yet — add friends to start.
                    </div>
                ) : (
                    <ul className="space-y-2">
                        {sorted.map((p) => (
                            <li
                                key={p.id}
                                onClick={() => onPlayerClick?.(p)}
                                className="flex items-center justify-between p-2 rounded-lg hover:bg-muted cursor-pointer transition"
                            >
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