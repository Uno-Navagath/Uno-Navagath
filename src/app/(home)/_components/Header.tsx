// components/Header.tsx
'use client';
import React from 'react';

export default function Header() {
    return (
        <header className="py-4 text-center">
            <h1 className="text-2xl font-extrabold">Uno Points</h1>
            <p className="text-xs text-muted-foreground mt-1">Navagath UNO Point tracker</p>
        </header>
    );
}
