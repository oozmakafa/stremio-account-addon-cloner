
import { NextResponse } from "next/server";
import { Account } from "@/app/types/accounts";
import { getAuth, getAddons } from "@/app/lib/stremio-client";

export async function POST(req: Request) {
    const primaryAccount: Account = await req.json();

    try {
        // get all addons from primary
        const auth = await getAuth(primaryAccount)
        const primaryAddons = await getAddons(auth);

        return NextResponse.json({ addons: primaryAddons });
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.error("Error fetching addons:", err.message);
            return NextResponse.json(
                { error: "Failed to fetching addons", details: err.message },
                { status: 500 }
            )
        } else {
            console.error('An unknown error occurred');
        }
    }
}
