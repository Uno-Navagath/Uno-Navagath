'use server'

import {createClient} from "@/lib/supabase/server";
import {redirect} from "next/navigation";


export async function signOut(redirectUrl: string) {

    console.log('Log in with Google clicked');
    const supabase = await createClient()
    console.log('Created client');
    const {error} = await supabase.auth.signOut();
    console.log('Logging out', error);
    redirect(redirectUrl);
}