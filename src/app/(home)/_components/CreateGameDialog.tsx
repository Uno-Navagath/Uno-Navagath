// components/CreateGameDialog.tsx
'use client';
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Player } from '@/models/player';
import { cn } from '@/lib/utils';

type Props = {
    players: Player[];
    selected: string[];
    setSelected: React.Dispatch<React.SetStateAction<string[]>>;
    open: boolean;
    setOpen: (v: boolean) => void;
    onCreate: () => Promise<void>;
};
export default function CreateGameDialog({ players, selected, setSelected, open, setOpen, onCreate }: Props) {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="w-full mb-4">➕ Start New Game</Button>
            </DialogTrigger>
            <DialogContent className="max-w-sm">
                <DialogHeader>
                    <DialogTitle>Select players</DialogTitle>
                </DialogHeader>

                <ScrollArea className="max-h-60 my-2">
                    <div className="space-y-2">
                        {players.map(p => {
                            const isSel = selected.includes(p.id);
                            return (
                                <div
                                    key={p.id}
                                    onClick={() => setSelected(prev => prev.includes(p.id) ? prev.filter(x => x !== p.id) : [...prev, p.id])}
                                    className={cn('p-3 rounded-lg cursor-pointer flex justify-between items-center', isSel ? 'bg-primary text-primary-foreground' : 'bg-card')}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-sm font-semibold">{p.name.slice(0,1).toUpperCase()}</div>
                                        <div>
                                            <div className="font-medium">{p.name}</div>
                                            <div className="text-xs text-muted-foreground">{p.gamesPlayed} games</div>
                                        </div>
                                    </div>
                                    <div className="text-sm">{isSel ? 'Selected' : ''}</div>
                                </div>
                            );
                        })}
                    </div>
                </ScrollArea>

                <DialogFooter>
                    <Button onClick={onCreate} disabled={selected.length < 2}>Create Game</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
