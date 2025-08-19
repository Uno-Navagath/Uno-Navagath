'use client';
import React, {useMemo, useState} from 'react';
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger} from '@/components/ui/dialog';
import {Button} from '@/components/ui/button';
import {Player} from '@/models/player';
import {cn} from '@/lib/utils';
import {ScrollArea} from '@/components/ui/scroll-area';
import {CheckIcon, XIcon} from 'lucide-react';

type Props = {
    players: Player[];
    selected: string[];
    setSelected: React.Dispatch<React.SetStateAction<string[]>>;
    open: boolean;
    setOpen: (v: boolean) => void;
    onCreate: () => Promise<void>;
};

export default function CreateGameDialog({players, selected, setSelected, open, setOpen, onCreate}: Props) {
    const [search, setSearch] = useState('');

    const filteredPlayers = useMemo(() =>
            players.filter(p => p.name.toLowerCase().includes(search.toLowerCase())),
        [search, players]
    );

    const toggleSelect = (id: string) => {
        setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="w-full mb-4">New Game</Button>
            </DialogTrigger>
            <DialogContent className="max-w-md w-full">
                <DialogHeader>
                    <DialogTitle>Select Players</DialogTitle>
                </DialogHeader>

                {/* Search */}
                <div className="mb-2">
                    <input
                        type="text"
                        placeholder="Search players..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full border border-border rounded-lg px-3 py-2 text-sm"
                    />
                </div>

                {/* Selected Chips */}
                {selected.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                        {selected.map(id => {
                            const p = players.find(pl => pl.id === id);
                            if (!p) return null;
                            return (
                                <div
                                    key={id}
                                    className="flex items-center gap-1 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm cursor-pointer"
                                    onClick={() => toggleSelect(id)}
                                >
                                    {p.name} <XIcon className="w-3 h-3"/>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Player list */}
                <ScrollArea className="max-h-[400px]">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {filteredPlayers.length === 0 && (
                            <div className="text-center text-muted-foreground py-4">
                                No players found
                            </div>
                        )}
                        {filteredPlayers.map(p => {
                            const isSel = selected.includes(p.id);
                            return (
                                <div
                                    key={p.id}
                                    onClick={() => toggleSelect(p.id)}
                                    className={cn(
                                        'p-3 rounded-lg flex justify-between items-center cursor-pointer transition-all hover:scale-[1.02]',
                                        isSel ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-card'
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-sm font-semibold">
                                            {p.name.slice(0, 1).toUpperCase()}
                                        </div>
                                        <div className="flex flex-col">
                                            <div className="font-medium">{p.name}</div>
                                            <div className="text-xs text-muted-foreground">{p.gamesPlayed} games</div>
                                        </div>
                                    </div>
                                    {isSel && <CheckIcon className="w-5 h-5 text-white"/>}
                                </div>
                            );
                        })}
                    </div>
                </ScrollArea>

                {/* Footer */}
                <DialogFooter className="sticky bottom-0 bg-card mt-2 pt-2 border-t border-border">
                    <Button onClick={onCreate} disabled={selected.length < 2} className="w-full">
                        Create Game ({selected.length})
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
