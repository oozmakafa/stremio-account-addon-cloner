
import { NextResponse } from "next/server";
import { Account } from "@/app/types/accounts";
import { pushAddonCollection, getAuth, getAddons } from "@/app/lib/stremio-client";
import { AddonData } from "@/app/types/addon";
import { handleAddon } from "@/app/services/addonHandlers";

type ClonePayload = {
  primary: Account;
  clones: Account[];
  addons: AddonData[];
};



export async function POST(req: Request) {
  const { primary, clones, addons }: ClonePayload = await req.json();


  try {
    let primaryAddons: AddonData[] = [];

    // use user selected addon
    if (addons.length > 0) {
      primaryAddons = addons;
    } else {
      // get all addons from primary
      try {
        const auth = await getAuth(primary);
        primaryAddons = await getAddons(auth);
      } catch (err) {
        if (err instanceof Error) {
          const message = `Primary Account: ${err.message}`;
          throw Error(message);
        }
      }
    }

    const clonedAddons: Record<string, AddonData[]> = {};

    for (const [index, acc] of clones.entries()) {
      try {
        const cloneAuth = await getAuth(acc); // authKey string

        // loop over primary addons and assign it to a clone account
        for (const addon of primaryAddons) {
          let current_addon: AddonData = { ...addon };

          if (acc.is_debrid_override && addon.manifest.id) {
            current_addon = await handleAddon(addon, acc);
          }

          if (!clonedAddons[cloneAuth]) clonedAddons[cloneAuth] = [];
          clonedAddons[cloneAuth].push(current_addon);
        }

      } catch (err) {
        if (err instanceof Error) {
          throw Error(`Clone Account # ${index + 1}: ${err.message}`);
        }
      }
    }

    for (const [authKey, addons] of Object.entries(clonedAddons)) {
      await pushAddonCollection(authKey, addons);
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
