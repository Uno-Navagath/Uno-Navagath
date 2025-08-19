"use client";

import {useMemo} from "react";
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {Line} from "react-chartjs-2";
import {
    CategoryScale,
    Chart as ChartJS,
    ChartOptions,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    TooltipItem,
} from "chart.js";
import {FiActivity, FiAward, FiHash, FiTarget, FiTrendingUp} from "react-icons/fi";
import {UserAvatar} from "@/components/user-avatar";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

type Analytics = {
    totalGames: number;
    totalRounds: number;
    totalScore: number;
    averageScore: number; // lower is better in your game
    winRate: number;      // 0..1
    weeklyScores: number[];
};

export default function UserData({
                                     player,
                                     analytics,
                                 }: {
    player: { name: string; email?: string; avatarUrl: string | null };
    analytics: Analytics;
}) {
    const winRatePct = Math.round(analytics.winRate * 100);

    // format helpers (memoized to avoid re-alloc on renders)
    const nf0 = useMemo(() => new Intl.NumberFormat(undefined, {maximumFractionDigits: 0}), []);
    const nf1 = useMemo(() => new Intl.NumberFormat(undefined, {maximumFractionDigits: 1}), []);

    // chart config (memoized)
    const chartData = useMemo(
        () => ({
            labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            datasets: [
                {
                    label: "Weekly Score (lower is better)",
                    data: analytics.weeklyScores,
                    borderColor: "rgb(79, 70, 229)",       // indigo-600
                    backgroundColor: "rgba(79, 70, 229, .15)",
                    pointRadius: 2,
                    borderWidth: 2,
                    tension: 0.3,
                },
            ],
        }),
        [analytics.weeklyScores]
    );

    const chartOptions = useMemo<ChartOptions<"line">>(
        () => ({
            responsive: true,
            maintainAspectRatio: false,
            interaction: {mode: "index", intersect: false},
            plugins: {
                legend: {display: false},
                tooltip: {
                    callbacks: {
                        label: (ctx: TooltipItem<"line">) => `Score: ${ctx.parsed.y}`,
                    },
                },
                title: {display: false},
            },
            scales: {
                x: {
                    type: "category",
                    grid: {
                        display: false,
                    },
                    ticks: {
                        maxRotation: 0,
                    },
                },
                y: {
                    type: "linear",
                    beginAtZero: true,
                    grid: {
                        display: true,
                        color: "rgba(0, 120, 40, .05)"
                    },
                    ticks: {
                        callback: (value: number | string) => `${value}`,
                    },
                },
            },
        }),
        []
    );

    const initials = (name: string) =>
        name
            .split(/\s+/)
            .slice(0, 2)
            .map((n) => n[0]?.toUpperCase())
            .join("");

    return (
        <section className="w-full">
            {/* Header: avatar + name + quick meta */}
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                    <UserAvatar imageUrl={player.avatarUrl} className="h-12 w-12"/>
                    <div className="min-w-0">
                        <h2 className="truncate text-2xl font-bold tracking-tight">{player.name}</h2>
                        <p className="text-xs text-gray-500">
                            Competitive overview • lower score is better
                        </p>
                    </div>
                </div>
            </div>

            {/* Grid: KPIs + chart */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* KPI deck */}
                <Card className="">
                    <CardHeader>
                        <h3 className="text-lg font-semibold">Overview</h3>
                    </CardHeader>
                    <CardContent className="pt-2">
                        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                            <li className="rounded-lg border border-gray-600 bg-background p-3 shadow-xs">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-500">Total Games</span>
                                    <FiTarget className="text-gray-400" aria-hidden/>
                                </div>
                                <div className="mt-1 text-xl font-semibold">
                                    {nf0.format(analytics.totalGames)}
                                </div>
                            </li>
                            <li className="rounded-lg border border-gray-600 bg-background p-3 shadow-xs">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-500">Rounds</span>
                                    <FiHash className="text-gray-400" aria-hidden/>
                                </div>
                                <div className="mt-1 text-xl font-semibold">
                                    {nf0.format(analytics.totalRounds)}
                                </div>
                            </li>
                            <li className="rounded-lg border border-gray-600 bg-background p-3 shadow-xs">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-500">Total Score</span>
                                    <FiActivity className="text-gray-400" aria-hidden/>
                                </div>
                                <div className="mt-1 text-xl font-semibold">
                                    {nf0.format(analytics.totalScore)}
                                </div>
                                <p className="mt-0.5 text-[11px] text-gray-500">lower is better</p>
                            </li>
                            <li className="rounded-lg border border-gray-600 bg-background p-3 shadow-xs">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-500">Avg / Round</span>
                                    <FiAward className="text-gray-400" aria-hidden/>
                                </div>
                                <div className="mt-1 text-xl font-semibold">
                                    {nf1.format(analytics.averageScore)}
                                </div>
                                <p className="mt-0.5 text-[11px] text-gray-500">lower is better</p>
                            </li>
                            <li className="rounded-lg border border-gray-600 bg-background p-3 shadow-xs">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-500">Win Rate</span>
                                    <FiTrendingUp className="text-gray-400" aria-hidden/>
                                </div>
                                <div className="mt-1 text-xl font-semibold">{winRatePct}%</div>
                                <div
                                    role="progressbar"
                                    aria-valuemin={0}
                                    aria-valuemax={100}
                                    aria-valuenow={winRatePct}
                                    className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-100"
                                >
                                    <div
                                        className="h-full rounded-full bg-emerald-500 transition-[width] duration-500 will-change-transform"
                                        style={{width: `${winRatePct}%`}}
                                    />
                                </div>
                            </li>
                        </ul>
                    </CardContent>
                </Card>

                {/* Weekly Performance chart */}
                <Card className="">
                    <CardHeader>
                        <h3 className="text-lg font-semibold">Weekly Performance</h3>
                        <p className="mt-1 text-xs text-gray-500">Sum of scores per weekday</p>
                    </CardHeader>
                    <CardContent>
                        <div className="h-56 sm:h-64 md:h-[18rem]">
                            <Line data={chartData} options={chartOptions}/>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </section>
    );
}
