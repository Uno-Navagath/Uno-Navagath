"use client";

import { useMemo, useCallback } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Crown, EllipsisVertical, Minus, Plus, Dot } from "lucide-react";

type PlayerScoreRowProps = {
    id: string;
    name: string;
    avatarUrl?: string | null;
    isHost?: boolean;              // shows a crown badge if true
    totalScore: number;
    avgScore: number;
    value?: number | "";           // current input score (unsaved)
    onChange: (value: number) => void;
    onRemove?: () => void | Promise<void>;
};

const fmtInt = (n: number) =>
    Number(n).toLocaleString(undefined, { maximumFractionDigits: 0 });

const fmtAvg = (n: number) =>
    Number(n).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });

export function PlayerScoreRow({
                                   id,
                                   name,
                                   avatarUrl,
                                   isHost = false,
                                   totalScore,
                                   avgScore,
                                   value = "",
                                   onChange,
                                   onRemove,
                               }: PlayerScoreRowProps) {
    const hasPending = value !== "" && !Number.isNaN(Number(value));

    const handleStep = useCallback(
        (delta: number) => {
            const current = Number(value || 0);
            const next = current + delta;
            onChange(next);
        },
        [value, onChange]
    );

    const initials = useMemo(() => name.slice(0, 2).toUpperCase(), [name]);

    return (
        <div
            className={[
                "flex items-center justify-between rounded-md border p-3",
                "hover:bg-muted/40 transition-colors",
                hasPending ? "ring-1 ring-primary/30 bg-primary/5" : ""
            ].join(" ")}
        >
            {/* Left: identity */}
            <div className="flex items-center gap-3 min-w-0">
                <Avatar className="h-9 w-9 shrink-0">
                    {avatarUrl ? <AvatarImage src={avatarUrl} /> : <AvatarFallback>{initials}</AvatarFallback>}
                </Avatar>

                <div className="flex min-w-0 flex-col">
                    <div className="flex items-center gap-2 min-w-0">
                        <span className="truncate font-medium">{name}</span>
                        {isHost && (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Badge variant="secondary" className="gap-1 px-1.5 py-0 text-[10px]">
                                            <Crown className="h-3 w-3" /> Host
                                        </Badge>
                                    </TooltipTrigger>
                                    <TooltipContent>Game host</TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}
                        {hasPending && (
                            <span className="inline-flex items-center text-xs text-primary/80">
                <Dot className="h-4 w-4" /> pending
              </span>
                        )}
                    </div>

                    <span className="text-xs text-muted-foreground">
            Total {fmtInt(totalScore)} • Avg {fmtAvg(avgScore)}
          </span>
                </div>
            </div>

            {/* Right: stepper + menu */}
            <div className="flex items-center gap-1">
                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleStep(-1)}
                >
                    <Minus className="h-4 w-4" />
                </Button>

                <Input
                    inputMode="numeric"
                    type="number"
                    value={value}
                    onChange={(e) => onChange(Number(e.target.value || 0))}
                    onKeyDown={(e) => {
                        if (e.key === "ArrowUp") handleStep(1);
                        if (e.key === "ArrowDown") handleStep(-1);
                    }}
                    placeholder="0"
                    className="w-20 text-center"
                />

                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleStep(1)}
                >
                    <Plus className="h-4 w-4" />
                </Button>

                {/* Overflow menu (Remove hidden here) */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <EllipsisVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" sideOffset={6}>
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => onRemove?.()}
                            disabled={!onRemove}
                        >
                            Remove player
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}
