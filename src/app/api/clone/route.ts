
import { NextResponse } from "next/server";
import { Account } from "@/app/types/accounts";
import { pushAddonCollection, getAuth, getAddons } from "@/app/lib/stremio-client";



type ClonePayload = {
  primary: Account;
  clones: Account[];
  addons: object[];
};


export async function POST(req: Request) {
  const { primary, clones, addons }: ClonePayload = await req.json();


  try {
    let primaryAddons: object[];

    // use user selected addon
    if (addons) {
      primaryAddons = addons;
    } else {
      // get all addons from primary
      const auth = await getAuth(primary);
      primaryAddons = await getAddons(auth);
    }


    const cloneAuthKeys: string[] = [];

    for (const acc of clones) {
      const cloneAuth = await getAuth(acc);
      cloneAuthKeys.push(cloneAuth);
    }

    // Push to each clone account
    for (const cloneAuth of cloneAuthKeys) {
      await pushAddonCollection(cloneAuth, primaryAddons);
    }

    return NextResponse.json({ message: "Addons cloned successfully" });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("Error cloning addons:", err.message);
      return NextResponse.json(
        { error: "Failed to clone addons", details: err.message },
        { status: 500 }
      )
    } else {
      console.error('An unknown error occurred');
    }
  }
}
