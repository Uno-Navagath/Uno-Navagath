'use client';

import { useEffect, useState } from "react";
import { Game, getGames, deleteGame, endGameAndSetPlayerTotals } from "@/models/game";
import { usePlayers } from "@/lib/firebase/hooks";
import { Trash2Icon, PlayIcon } from "lucide-react";

export default function AllGamesPage() {
    const [games, setGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState<string>("all");

    const { players } = usePlayers();

    useEffect(() => {
        fetchGames();
    }, []);

    const fetchGames = async () => {
        setLoading(true);
        const result = await getGames();
        if (result.success && result.data) setGames(result.data);
        else setError(result.error ?? "Unknown error");
        setLoading(false);
    };

    const getPlayerName = (id: string) => players.find(p => p.id === id)?.name || id;
    const getTotalScore = (game: Game, pid: string) => game.rounds.reduce((sum, r) => sum + (r.scores[pid] || 0), 0);
    const formatDate = (d: Date) => new Date(d).toLocaleString();

    const handleDelete = async (id: string) => {
        if (confirm("Delete this game?")) {
            await deleteGame(id);
            fetchGames();
        }
    };

    const handleEndGame = async (id: string) => {
        if (confirm("End this game and update player.ts totals?")) {
            await endGameAndSetPlayerTotals(id);
            fetchGames();
        }
    };

    const filteredGames = games.filter(game => {
        const matchesStatus =
            filterStatus === "all" || (filterStatus === "active" && game.isActive) || (filterStatus === "finished" && !game.isActive);
        const matchesSearch = game.players.some(pid => getPlayerName(pid).toLowerCase().includes(searchTerm.toLowerCase()));
        return matchesStatus && matchesSearch;
    });

    if (loading) return <div className="flex justify-center items-center h-screen text-muted-foreground">Loading...</div>;
    if (error) return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
    if (!games.length) return <div className="flex justify-center items-center h-screen text-muted-foreground">No games found.</div>;

    return (
        <div className="p-4 max-w-6xl mx-auto space-y-4">
            {/* Filters */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <input
                    type="text"
                    placeholder="Search by player..."
                    className="border border-border rounded-lg p-2 text-sm flex-1"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
                <div className="flex gap-2 text-xs">
                    {["all", "active", "finished"].map(status => (
                        <button
                            key={status}
                            className={`px-3 py-1 rounded-full border ${filterStatus === status ? "bg-primary text-white" : "bg-card"}`}
                            onClick={() => setFilterStatus(status)}
                        >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Games Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredGames.map(game => (
                    <div key={game.id} className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
                        {/* Header */}
                        <div className="flex justify-between items-center px-4 py-2 bg-muted/20">
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${game.isActive ? "bg-green-100 text-green-800" : "bg-secondary text-secondary-foreground"}`}>
                {game.isActive ? "Active" : "Finished"}
              </span>
                            <span className="text-[10px] text-muted-foreground">{formatDate(game.updatedAt)}</span>
                        </div>

                        {/* Player Scores & Rounds */}
                        <div className="px-4 py-3 space-y-2">
                            {game.players.map(pid => (
                                <div key={pid} className="flex justify-between items-center">
                                    <span className="font-medium">{getPlayerName(pid)}</span>
                                    <span className="font-semibold text-primary">{getTotalScore(game, pid)}</span>
                                </div>
                            ))}
                            <div className="text-xs text-muted-foreground">
                                {game.rounds.length} {game.rounds.length === 1 ? "round" : "rounds"}
                            </div>

                            {/* Rounds breakdown */}
                            <div className="overflow-x-auto flex gap-2 mt-1 pb-1">
                                {game.rounds.map(round => (
                                    <div key={round.roundNumber} className="flex-shrink-0 bg-muted/20 rounded px-2 py-1 text-[11px]">
                                        <div className="font-semibold">R{round.roundNumber}</div>
                                        {Object.entries(round.scores).map(([pid, score]) => (
                                            <div key={pid}>{getPlayerName(pid)}: {score}</div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-2 px-4 py-2 border-t border-border">
                            {game.isActive && (
                                <button onClick={() => handleEndGame(game.id)} className="text-green-600 flex items-center gap-1 text-sm">
                                    <PlayIcon className="w-4 h-4" /> End
                                </button>
                            )}
                            <button onClick={() => handleDelete(game.id)} className="text-red-500 flex items-center gap-1 text-sm">
                                <Trash2Icon className="w-4 h-4" /> Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
