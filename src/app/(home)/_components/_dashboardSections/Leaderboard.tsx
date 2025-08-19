'use client'
import {FiTrendingUp} from "react-icons/fi";
import {Crown} from "lucide-react";
import {UserAvatar} from "@/components/user-avatar";

export type LeaderboardPlayer = {
    id: string;
    name: string;
    avatarUrl: string | null;
    gamesPlayed: number;
    score: number;
    averageScore: number;
    wins: number;
    streak: number;
};

function PlayerCard({player, rank}: { player: LeaderboardPlayer; rank: number }) {
    console.log("Avatar of ", player.name, player.avatarUrl)
    return (
        <div className="flex flex-col rounded-xl border p-4 shadow-sm">
            {/* Row 1: Avatar, name, rank, games/wins */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <UserAvatar imageUrl={(player.avatarUrl ?? "") as string}/>
                    <div>
                        <p className="font-semibold ">{player.name}</p>
                        <p className="text-xs ">
                            {player.gamesPlayed} games · {player.wins} wins
                        </p>
                    </div>
                </div>
                {rank === 1 && (
                    <Crown className="h-6 w-6 text-yellow-400"/>
                )}

                {rank === 2 && (
                    <Crown className="h-6 w-6 text-gray-300"/>
                )}

                {rank === 3 && (
                    <Crown className="h-6 w-6 text-amber-700/90"/>
                )}
            </div>

            {/* Row 2: Stats line */}
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm ">
               <span>
  Avg: {Number(player.averageScore).toLocaleString(undefined, {
                   maximumFractionDigits: 0
               })}
</span>
                <span>Total: {player.score}</span>
                <span>Win rate: {Math.round((player.wins / Math.max(1, player.gamesPlayed)) * 100)}%</span>
                {player.streak > 1 && (
                    <span className="flex items-center gap-1 text-indigo-600 font-medium">
            <FiTrendingUp/> {player.streak}× streak
          </span>
                )}
            </div>
        </div>
    );
}

export default function Leaderboard({
                                        players,
                                    }: {
    players: LeaderboardPlayer[];
}) {
    return (
        <section className="mx-auto max-w-5xl p-4">
            <h2 className="mb-4 text-2xl font-bold">Leaderboard</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {players.map((p, i) => (
                    <PlayerCard key={p.id} player={p} rank={i + 1}/>
                ))}
            </div>
        </section>
    );
}
