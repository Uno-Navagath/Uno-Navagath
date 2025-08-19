import {NextResponse} from "next/server";
import {createClient} from "@/lib/supabase/server";
import database from "@/database/index"; // drizzle instance
import {players} from "@/database/schema"; // your players table
import {eq} from "drizzle-orm";

export async function GET(request: Request) {
    const {searchParams, origin} = new URL(request.url);
    const code = searchParams.get("code");
    let next = searchParams.get("next") ?? "/";

    if (!next.startsWith("/")) {
        next = "/";
    }

    if (code) {
        const supabase = await createClient();
        const {error} = await supabase.auth.exchangeCodeForSession(code);

        if (!error) {
            const {
                data: {user},
            } = await supabase.auth.getUser();

            if (user) {
                // Ensure player.ts exists
                const existing = await database
                    .select()
                    .from(players)
                    .where(eq(players.userId, user.id))
                    .limit(1);

                if (existing.length === 0) {
                    await database.insert(players).values({
                        userId: user.id, // link to auth.users.id
                        name: user.user_metadata.full_name ?? "Unnamed",
                        email: user.email ?? "",
                        avatarUrl: user.user_metadata.avatar_url,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    });
                    console.log("Player created for user:", user.id);
                } else {
                    console.log("Player already exists:", user.id);
                }
            }

            // Redirect logic (your existing code)
            const forwardedHost = request.headers.get("x-forwarded-host");
            const isLocalEnv = process.env.NODE_ENV === "development";

            if (isLocalEnv) {
                return NextResponse.redirect(`${origin}${next}`);
            } else if (forwardedHost) {
                return NextResponse.redirect(`https://${forwardedHost}${next}`);
            } else {
                return NextResponse.redirect(`${origin}${next}`);
            }
        }
    }

    return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
