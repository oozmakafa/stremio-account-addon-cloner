
import { NextResponse } from "next/server";
import { pullAddonCollection, login, pushAddonCollection } from "@/app/lib/stremio-client";



type CloneAccount = {
  mode: "credentials" | "authkey";
  email: string;
  password: string;
  authkey: string;
};

type ClonePayload = {
  primary: CloneAccount;
  clones: CloneAccount[];
};

const getAuth = async (acc: CloneAccount) => {
  let authKey: string = '';

  if (acc.mode === "authkey") {
    return acc.authkey;
  } else {
    const account = await login(
      acc.email,
      acc.password,
    );
    authKey = account.result.authKey;
  }

  return authKey;

}

export async function POST(req: Request) {
  const { primary, clones }: ClonePayload = await req.json();


  const getAddons = async (authKey: string) => {
    let primaryAddons = [] as any[];

    const primaryCollection = await pullAddonCollection(authKey);

    primaryAddons = primaryCollection.result.addons;

    return primaryAddons;
  }

  try {

    const primaryAuth = await getAuth(primary);

    const primaryAddons = await getAddons(primaryAuth);

    // Push to each clone account
    for (const acc of clones) {
      const cloneAuth = await getAuth(acc);

      await pushAddonCollection(cloneAuth, primaryAddons);
    }

    return NextResponse.json({ message: "Addons cloned successfully" });
  } catch (err: any) {
    console.error("Error cloning addons:", err);
    return NextResponse.json(
      { error: "Failed to clone addons", details: err.message },
      { status: 500 }
    )
  }
}
