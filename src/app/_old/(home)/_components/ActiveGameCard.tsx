// components/ActiveGameCard.tsx
'use client';
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Player } from '@/models/player';
import { Game, GameRound } from '@/models/game';

type Props = {
    activeGame: Game;
    players: Player[];
    roundInputs: Record<string, string>;
    setRoundInputs: (v: Record<string,string>) => void;
    onAddRound: () => Promise<void>;
    onEndGame: () => Promise<void>;
};

export default function ActiveGameCard({ activeGame, players, roundInputs, setRoundInputs, onAddRound, onEndGame }: Props) {
    const roundNumber = activeGame.rounds.length + 1;

    const roundsPreview = useMemo(() => activeGame.rounds.slice().reverse().slice(0,5), [activeGame.rounds]);

    return (
        <Card className="mb-24">
            <CardHeader>
                <CardTitle>Ongoing game</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="mb-2 text-sm text-muted-foreground">Round {roundNumber}</div>

                <div className="space-y-3">
                    {activeGame.players.map(pid => {
                        const p = players.find(x => x.id === pid);
                        return (
                            <div key={pid} className="flex items-center justify-between bg-card p-3 rounded-lg">
                                <div>
                                    <div className="font-semibold">{p?.name ?? '—'}</div>
                                    <div className="text-xs text-muted-foreground">Total: {p?.totalScore ?? 0}</div>
                                </div>

                                <Input
                                    className="w-20 text-center"
                                    type="number"
                                    inputMode="numeric"
                                    value={roundInputs[pid] ?? ''}
                                    onChange={(e) => setRoundInputs({ ...roundInputs, [pid]: e.target.value })}
                                />
                            </div>
                        );
                    })}
                </div>

                <div className="mt-4 flex gap-2">
                    <Button className="flex-1" onClick={onAddRound}>➕ Add Round</Button>
                    <Button className="flex-1" variant="destructive" onClick={onEndGame}>🛑 End</Button>
                </div>

                {activeGame.rounds.length > 0 && (
                    <>
                        <Separator className="my-4" />
                        <div className="text-sm font-medium mb-2">Recent rounds</div>
                        <ScrollArea className="max-h-40">
                            <div className="space-y-2">
                                {roundsPreview.map((r: GameRound) => (
                                    <div key={r.roundNumber} className="flex justify-between text-sm">
                                        <div>Round {r.roundNumber}</div>
                                        <div className="text-muted-foreground">
                                            {activeGame.players.map(pid => `${players.find(p => p.id === pid)?.name ?? pid}: ${r.scores[pid] ?? 0}`).join(' • ')}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </>
                )}
            </CardContent>
        </Card>
    );
}
