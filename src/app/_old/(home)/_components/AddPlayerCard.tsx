// components/AddPlayerCard.tsx
'use client';
import React, {useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {toast} from 'sonner';
import {Button} from '@/components/ui/button';
import {createPlayer} from "@/models/player";


export default function AddPlayerCard() {
    const [name, setName] = useState('');

    const onAdd = async () => {
        console.log('Adding player.ts...');
        const n = name.trim();
        if (!n) {
            if (toast) toast.warning('Name required'); else alert('Enter name');
            return;
        }
        const res = await createPlayer({name: n});
        console.log('Result:', res);
        if (!res.success) {
            if (toast) toast.error('Failed: ' + res.error?.toString() || ""); else alert(res.error);
        } else {
            setName('');
            if (toast) toast.error('Player added');
        }
    };

    return (
        <Card className="mb-4">
            <CardHeader>
                <CardTitle>Add player</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-2">
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Player name"/>
                <Button onClick={onAdd}>Add</Button>
            </CardContent>
        </Card>
    );
}
