import {createClient} from "@/lib/supabase/server";
import Leaderboard from "./_dashboardSections/Leaderboard";
import UserData from "./_dashboardSections/UserData";
import RecentGames from "./_dashboardSections/RecentGames";
import Link from "next/link";
import {Plus} from "lucide-react";
import {getPlayerAnalytics, getTopPlayers} from "@/lib/database/actions/player";
import DashboardHeader from "@/app/(home)/_components/_dashboardSections/DashboardHeader";


export default async function Dashboard() {
    const supabase = await createClient();
    const {data: {user}, error} = await supabase.auth.getUser();

    const playersWith = await getTopPlayers();

    const {player, analytics} = await getPlayerAnalytics();
    if (error || !user) {
        console.error("Error fetching user:", error);
        return <div>Error fetching user</div>;
    }


    return (
        <main className="max-w-4xl space-y-8 p-4 mx-auto">
            {/*<DashboardHeader user={user}/>*/}
            <Leaderboard players={playersWith}/>
            <UserData player={player} analytics={analytics}/>
            <RecentGames/>
            {/* Floating Action Button */}
            <Link
                href="/game"
                className="fixed bottom-6 right-6 flex items-center justify-center w-14 h-14 rounded-full bg-primary text-white shadow-lg hover:bg-primary/90 transition"
            >
                <Plus className="w-6 h-6"/>
            </Link>
        </main>
    );
}
