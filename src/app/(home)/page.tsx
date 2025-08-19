import Login from "./_components/Login";
import {createClient} from "@/lib/supabase/server";
import Dashboard from "./_components/Dashboard";

export default async function HomePage() {

    const supabase = await createClient();
    const user = (await supabase.auth.getUser()).data.user;

    console.log('User:', user);

    if (!user) {
        return (
            <Login/>
        );
    }

    return (
        <Dashboard/>
    );

}
