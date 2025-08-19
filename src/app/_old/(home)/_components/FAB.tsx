// components/FAB.tsx
'use client';
import React from 'react';
import { Button } from '@/components/ui/button';

type Props = {
    onAddRound?: () => void;
};

export default function FAB({ onAddRound }: Props) {
    return (
        <div className="fixed right-4 bottom-6 z-50 flex flex-col gap-2">
            <Button className="h-14 w-14 rounded-full p-0" onClick={onAddRound}>➕</Button>
        </div>
    );
}
