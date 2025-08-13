'use client';

import {useEffect, useState} from "react";
import {Game, getGames} from "@/models/game";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {usePlayers} from "@/lib/hooks";
import Link from "next/link";
import {ChevronRightIcon} from "lucide-react";

export default function RecentGames() {
    const [games, setGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const {players} = usePlayers();

    useEffect(() => {
        getGames().then((result) => {
            if (result.success && result.data) {
                setGames(result.data.slice(0, 3));
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

    const formatGameDate = (date: Date) => {
        // try {
            return new Date(date).toString();
        // } catch (e) {
        //     console.log(date);
        //
        //     console.error("Error formatting date :", e);
        //     return "Invalid Date sd asdasjhdikajdhaskj";
        // }
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
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Games</CardTitle>
                <Link
                    href="/games"
                    className="text-sm text-primary"
                >
                    <div className="flex items-center gap-2">
                        View All
                        <ChevronRightIcon className="w-4 h-4"/>
                    </div>
                </Link>
            </CardHeader>
            <CardContent className="p-0">
                {games.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground">
                        No games played yet.
                    </div>
                ) : (
                    <div className="flex overflow-x-auto gap-4 px-4 pb-4 scroll-smooth">
                        {games.map((game) => (
                            <div
                                key={game.id}
                                className="
                                    min-w-[220px]
                                    bg-card
                                    border
                                    border-border
                                    rounded-xl
                                    shadow-sm
                                    transition-all
                                    duration-200
                                    flex-shrink-0
                                    overflow-hidden
                                    snap-start
                                "
                            >
                                {/* Header */}
                                <div className="flex items-center justify-between px-3 py-2 bg-muted/30">
                                    <span
                                        className={`
                                            text-xs font-medium px-2 py-0.5 rounded-full
                                            ${game.isActive
                                            ? "bg-green-100 text-green-800"
                                            : "bg-secondary text-secondary-foreground"}
                                        `}
                                    >
                                        {game.isActive ? "Active" : "Finished"}
                                    </span>
                                    <span className="text-[10px] text-muted-foreground">
                                        {formatGameDate(game.updatedAt)}
                                    </span>
                                </div>

                                {/* Player Scores */}
                                <div className="px-4 py-3">
                                    <div className="flex flex-col gap-2">
                                        {game.players.map((pid) => (
                                            <div
                                                key={pid}
                                                className="flex justify-between items-center"
                                            >
                                                <span className="text-sm font-medium text-foreground truncate">
                                                    {getPlayerName(pid)}
                                                </span>
                                                <span className="text-sm font-semibold text-primary">
                                                    {getTotalScore(game, pid)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="px-4 py-2 border-t border-border text-xs text-muted-foreground">
                                    {game.rounds.length}{" "}
                                    {game.rounds.length === 1
                                        ? "round"
                                        : "rounds"}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
