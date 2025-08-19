"use client";

import {useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import {Card} from "@/components/ui/card";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {addPlayer, getGameDetails} from "@/lib/database/actions/game";
import {getPlayers} from "@/lib/database/actions/player";
import {UserAvatar} from "@/components/user-avatar";

type Player = {
    id: string;
    name: string;
    avatarUrl: string | null;
};

type AddPlayersButtonProps = {
    gameId: string;
};

export function AddPlayersButton({gameId}: AddPlayersButtonProps) {
    const [players, setPlayers] = useState<Player[]>([]);
    const [selectedPlayers, setSelectedPlayers] = useState<Set<string>>(new Set());
    const [search, setSearch] = useState("");
    const [gamePlayerIds, setGamePlayerIds] = useState<Set<string>>(new Set());

    useEffect(() => {
        async function fetchData() {
            // Fetch all players
            const allPlayers: Player[] = await getPlayers();
            setPlayers(allPlayers);

            // Fetch players already in game
            const game = await getGameDetails(gameId);
            if (!game) return;
            const existingIds = new Set(game.players.map((gp: any) => gp.player.id));
            setGamePlayerIds(existingIds);
        }

        fetchData();
    }, [gameId]);

    const toggleSelect = (id: string) => {
        if (gamePlayerIds.has(id)) return; // cannot select already in game
        setSelectedPlayers((prev) => {
            const newSet = new Set(prev);
            newSet.has(id) ? newSet.delete(id) : newSet.add(id);
            return newSet;
        });
    };

    const handleAddPlayers = async () => {
        for (const playerId of selectedPlayers) {
            await addPlayer(gameId, playerId);
        }
        setSelectedPlayers(new Set());
        // Refresh game players to disable added ones
        const game = await getGameDetails(gameId);
        if (!game) return;
        setGamePlayerIds(new Set(game.players.map((gp: any) => gp.player.id)));
    };

    const filteredPlayers = players.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>Add Players</Button>
            </DialogTrigger>

            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Select Players to Add</DialogTitle>
                </DialogHeader>

                <Input
                    placeholder="Search players..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="mb-4"
                />

                <div className="space-y-2 max-h-80 overflow-y-auto">
                    {filteredPlayers.map((p) => {
                        const isDisabled = gamePlayerIds.has(p.id);
                        const isSelected = selectedPlayers.has(p.id);

                        return (
                            <Card
                                key={p.id}
                                className={`flex items-center gap-4 p-2 cursor-pointer ${
                                    isSelected ? "border-primary border-2" : "border border-gray-200"
                                } ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                                onClick={() => toggleSelect(p.id)}
                            >
                                <UserAvatar imageUrl={p.avatarUrl} className="h-8 w-8"/>
                                <span className="flex-1">{p.name}</span>
                                {isSelected && !isDisabled && <span>✓</span>}
                                {isDisabled && <span>Already in game</span>}
                            </Card>
                        );
                    })}
                </div>

                <div className="flex justify-end mt-4 gap-2">
                    <Button variant="default" onClick={handleAddPlayers} disabled={selectedPlayers.size === 0}>
                        Add Selected
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
