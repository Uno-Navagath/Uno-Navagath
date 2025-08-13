'use client';

import { useEffect, useState } from "react";
import { Game, getGames } from "@/models/game";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { usePlayers } from "@/lib/hooks";

export default function GameHistory() {
    const [games, setGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { players } = usePlayers();

    useEffect(() => {
        getGames().then((result) => {
            if (result.success && result.data) {
                setGames(result.data);
            } else {
                setError(result.error ?? "Unknown error");
            }
            setLoading(false);
        });
    }, []);

    const getPlayerName = (id: string) =>
        players.find((p) => p.id === id)?.name || id;

    const getTotalScore = (game: Game, pid: string) => {
        return game.rounds.reduce((sum, round) => {
            return sum + (round.scores[pid] || 0);
        }, 0);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-40 text-muted-foreground">
                Loading...
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-40 text-red-500">
                {error}
            </div>
        );
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Game History</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <ScrollArea className="h-[400px]">
                    {games.length === 0 ? (
                        <div className="p-4 text-center text-muted-foreground">
                            No games played yet.
                        </div>
                    ) : (
                        <div>
                            {games.map((game, i) => (
                                <div key={game.id}>
                                    <div className="p-4 hover:bg-muted/50 transition">
                                        <div className="flex justify-between items-center">
                                            {!game.isActive && (
                                                <span className="text-xs bg-secondary px-2 py-1 rounded-full">
                                                    Finished
                                                </span>
                                            )}
                                            {game.isActive && (
                                                <span className="text-xs bg-green-200 text-green-900 px-2 py-1 rounded-full">
                                                    Active
                                                </span>
                                            )}
                                        </div>
                                        <div className="mt-2 grid grid-cols-2 gap-2">
                                            {game.players.map((pid) => (
                                                <div
                                                    key={pid}
                                                    className="flex justify-between text-sm"
                                                >
                                                    <span>
                                                        {getPlayerName(pid)}
                                                    </span>
                                                    <span className="font-semibold">
                                                        {getTotalScore(
                                                            game,
                                                            pid
                                                        )}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    {i < games.length - 1 && (
                                        <Separator className="my-1" />
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </CardContent>
        </Card>
    );
}
