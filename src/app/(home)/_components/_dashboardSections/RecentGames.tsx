"use client";

import {useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {getRecentGames} from "@/lib/database/actions/game";
import Link from "next/link";
import {UserAvatar} from "@/components/user-avatar";

type GamePlayer = {
    playerId: string;
    playerName: string;
    playerAvatar: string | null;
    totalScore: number;
    avgScore: number;
};

type Game = {
    gameId: string;
    status: string;
    createdAt: Date;
    players: GamePlayer[];
    winner?: GamePlayer;
};

export default function RecentGames() {
    const [games, setGames] = useState<Game[]>([]);

    useEffect(() => {
        (async () => {
            const raw = await getRecentGames(3);

            // group players by gameId
            const grouped = raw.reduce((acc: Record<string, Game>, row) => {
                if (!acc[row.gameId]) {
                    acc[row.gameId] = {
                        gameId: row.gameId,
                        status: row.status,
                        createdAt: row.createdAt,
                        players: [],
                    };
                }

                acc[row.gameId].players.push({
                    playerId: row.playerId,
                    playerName: row.playerName,
                    playerAvatar: row.playerAvatar,
                    totalScore: row.totalScore,
                    avgScore: row.avgScore,
                });

                return acc;
            }, {});

            // determine winner if finished
            const finalGames = Object.values(grouped).map((g) => {
                if (g.status === "finished") {
                    const winner = g.players.reduce((prev, curr) =>
                        curr.totalScore < prev.totalScore ? curr : prev
                    );
                    return {...g, winner};
                }
                if (g.status === "active") {
                    const leader = g.players.reduce((prev, curr) =>
                        curr.totalScore < prev.totalScore ? curr : prev
                    );
                    return {...g, winner: leader};
                }
                return g;
            });

            setGames(finalGames);
        })();
    }, []);

    const initials = (name: string) =>
        name.split(" ").map((n) => n[0]).join("").toUpperCase();

    return (
        <div className="p-4 border rounded-md">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Recent Games</h2>
                <Button variant="link" size="sm" asChild>
                    <Link href="/game/list">View All</Link>
                </Button>
            </div>

            {games.length === 0 ? (
                <p className="text-gray-500">No recent games...</p>
            ) : (
                <ul className="space-y-4">
                    {games.map((g) => (
                        <li key={g.gameId} className="p-3 border rounded-lg">
                            {/* Players */}
                            <div className="flex flex-wrap items-center gap-4">
                                {g.players.map((p) => (
                                    <div key={p.playerId} className="flex items-center gap-2">
                                        <UserAvatar imageUrl={p.playerAvatar} className="h-8 w-8"/>
                                        <div className="text-sm">
                                            <p className="font-medium">{p.playerName}</p>
                                            <p className="text-xs text-gray-500">
                                                {Number(p.totalScore).toLocaleString(undefined, {maximumFractionDigits: 0})} pts
                                                |
                                                avg {Number(p.avgScore).toLocaleString(undefined, {
                                                minimumFractionDigits: 0,
                                                maximumFractionDigits: 2
                                            })}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Status + Winner/Leader */}
                            <div className="mt-3 flex items-center justify-between">
                                <div>
                                    <span className="text-sm capitalize">State: {g.status}</span>
                                    {g.winner && (
                                        <p className="text-sm text-green-600">
                                            {g.status === "finished"
                                                ? `Winner: ${g.winner.playerName}`
                                                : `Leader: ${g.winner.playerName}`}
                                        </p>
                                    )}
                                </div>

                                <div className="flex gap-2">
                                    {g.status === "active" ? (
                                        <Button size="sm" asChild>
                                            <Link href={`/game/${g.gameId}`}>Play</Link>
                                        </Button>
                                    ) : (
                                        <Button size="sm" variant="secondary" asChild>
                                            <Link href={`/game/${g.gameId}`}>View</Link>
                                        </Button>
                                    )}

                                    {/* Round details dialog */}
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button size="sm" variant="outline">Rounds</Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Round Details</DialogTitle>
                                            </DialogHeader>
                                            <p>TODO: Fetch and show rounds for game {g.gameId}</p>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
