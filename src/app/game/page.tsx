"use client";

import {useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import {Card} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {Checkbox} from "@/components/ui/checkbox";
import {createClient} from "@/lib/supabase/client";
import {getPlayers} from "@/lib/database/actions/player";
import {createGame} from "@/lib/database/actions/game";
import {UserAvatar} from "@/components/user-avatar";

type Player = {
    id: string;
    name: string;
    avatarUrl: string | null;
    userId: string;
};

export default function CreateGamePage() {
    const [players, setPlayers] = useState<Player[]>([]);
    const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
    const [hostId, setHostId] = useState<string>("");

    // Fetch players + current user
    useEffect(() => {
        async function fetchData() {
            const supabase = createClient();
            const {
                data: {user},
            } = await supabase.auth.getUser();

            if (!user) return; // not logged in

            const res = await getPlayers();
            setPlayers(res);

            // Auto-select current user as host
            const host = res.find((p) => p.userId === user.id);
            if (host) {
                setHostId(host.id);
                setSelectedPlayers([host.id]);
            }
        }

        fetchData();
    }, []);

    const togglePlayer = (id: string) => {
        if (id === hostId) return; // prevent unselecting host
        setSelectedPlayers((prev) =>
            prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
        );
    };

    const handleSubmit = async () => {
        await createGame({hostId, playerIds: selectedPlayers});
    };

    const initials = (name: string) =>
        name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase();

    return (
        <div className="max-w-2xl mx-auto p-6 space-y-6">
            <h1 className="text-2xl font-bold">Create New Game</h1>

            {/* Player Selection */}
            <Card className="p-4 space-y-4">
                <Label>Select Players</Label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {players.map((p) => (
                        <div
                            key={p.id}
                            className="flex items-center gap-2 p-2 border rounded-md"
                        >
                            <Checkbox
                                checked={selectedPlayers.includes(p.id)}
                                onCheckedChange={() => togglePlayer(p.id)}
                                disabled={p.id === hostId} // host locked
                            />
                            <UserAvatar imageUrl={p.avatarUrl} className="h-8 w-8"/>
                            <span>
                {p.name}{" "}
                                {p.id === hostId && (
                                    <span className="text-xs text-primary font-semibold">
                    (You)
                  </span>
                                )}
              </span>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Submit */}
            <Button
                onClick={handleSubmit}
                disabled={selectedPlayers.length < 2} // at least 2 players required
            >
                Create Game
            </Button>
        </div>
    );
}
