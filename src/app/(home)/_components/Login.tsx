'use client'
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {ImGoogle} from "react-icons/im";
import {signInWithGoogle} from "@/lib/supabase/actions/login-action";

export default function Login() {

    return (
        <main className="flex h-screen flex-col items-center justify-center p-24">
            <div className="flex flex-col mt-auto items-center gap-4 h-fit ">
                <h1>UNO Points</h1>
                <h2>Create an account</h2>

                <form>
                    <Button
                        formAction={() => signInWithGoogle(`${window.location.origin}/auth/callback`)}
                        className={cn(
                            "rounded-full px-6 py-3"
                        )}
                    >
                        <div className="flex items-center gap-2">
                            <ImGoogle className="h-5 w-5 group-hover:scale-110 transition-transform duration-200"/>
                            Sign in with Google
                        </div>
                    </Button>
                </form>
            </div>
            <p className="mt-auto">
                By clicking continue, you agree to our <a className="text-primary underline">Terms of Service</a> and <a
                className="text-primary underline">Privacy Policy</a>
            </p>
        </main>
    );
}
