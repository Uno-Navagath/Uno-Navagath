import Link from "next/link";
import {formatDistanceToNow} from "date-fns";
import {getPlayerGames} from "@/lib/database/actions/game";

export default async function GameListPage() {
    const gameList = await getPlayerGames();

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Available Games</h1>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {gameList.map((game) => (
                    <Link href={`/game/${game.id}`} key={game.id} className="block">
                        <div
                            className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 hover:shadow-lg transition-shadow">
                            <div className="flex items-center gap-3 mb-3">
                                {game.hostAvatar ? (
                                    <img
                                        src={game.hostAvatar}
                                        className="w-10 h-10 rounded-full"
                                    />
                                ) : (
                                    <div
                                        className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-gray-700 dark:text-gray-200">
                                        ?
                                    </div>
                                )}
                                <div>
                                    <p className="font-medium">{game.hostName}'s Game</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {formatDistanceToNow(new Date(game.createdAt), {
                                            addSuffix: true,
                                        })}
                                    </p>
                                </div>
                            </div>

                            <div className="flex justify-between items-center">
                                {/* Status */}
                                <span
                                    className={`px-2 py-1 rounded text-sm ${
                                        game.status === "waiting"
                                            ? "bg-yellow-100 text-yellow-800"
                                            : game.status === "active"
                                                ? "bg-green-100 text-green-800"
                                                : "bg-gray-100 text-gray-800"
                                    }`}
                                >
                                    {game.status.charAt(0).toUpperCase() + game.status.slice(1)}
                                </span>
                                {game.currentRound && (
                                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                        Round {game.currentRound}
                                    </p>
                                )}
                            </div>

                            {/* Current round */}

                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
