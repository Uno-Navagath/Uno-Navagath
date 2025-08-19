import GameActiveView from "./_components/GameActiveView";
import GameFinishedView from "./_components/GameFinishedView";
import {getGameDetails} from "@/lib/database/actions/game";

export default async function GamePage({params}: { params: any }) {
    const {id} = await params;
    const game = await getGameDetails(id);
    if (!game) return <div>Game not found</div>;
    console.log('Game:', game);
    return (
        <div className="max-w-3xl mx-auto p-6 space-y-6">
            <h1 className="text-2xl font-bold">Game: {game.id}</h1>
            {game.status === "active" ? (
                <GameActiveView game={game}/>
            ) : (
                <GameFinishedView game={game}/>
            )}
        </div>
    );
}
