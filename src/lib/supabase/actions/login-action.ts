'use server'

import {createClient} from "@/lib/supabase/server";
import {redirect} from "next/navigation";


export async function signInWithGoogle(redirectUrl: string) {

    console.log('Log in with Google clicked');
    const supabase = await createClient()
    console.log('Created client');
    const {error, data} = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo:  redirectUrl
        }
    });
    console.log('Logged in with Google', data, error);
    if (data?.url) {
        redirect(data.url);
    }
}