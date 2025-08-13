// components/EditPlayerDialog.tsx
'use client';
import {useEffect, useState} from 'react';
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from '@/components/ui/dialog';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {deletePlayer, Player, updatePlayer} from '@/models/player';

type Props = {
    open: boolean;
    onClose: () => void;
    player: Player | null;
};

export default function EditPlayerDialog({open, onClose, player}: Props) {
    const [name, setName] = useState<string>(player?.name ?? "");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setName(player?.name ?? "");
    }, [player?.name,]);
    if (!player) return null;

    const handleSave = async () => {
        setLoading(true);
        await updatePlayer(player.id, {name});
        setLoading(false);
        onClose();
    };

    const handleDelete = async () => {
        if (confirm(`Remove ${player.name}?`)) {
            setLoading(true);
            await deletePlayer(player.id);
            setLoading(false);
            onClose();
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Player</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Player name"/>
                </div>
                <DialogFooter className="flex justify-between">
                    <Button variant="destructive" onClick={handleDelete} disabled={loading}>
                        Remove
                    </Button>
                    <Button onClick={handleSave} disabled={loading}>
                        Save
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
