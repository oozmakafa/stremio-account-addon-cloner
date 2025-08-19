import { NextResponse } from "next/server";
import type { Account } from "@/app/types/accounts";
import { pushAddonCollection, getAuth, getAddons } from "@/app/lib/stremio-client";
import type { AddonData } from "@/app/types/addon";
import { handleAddon } from "@/app/services/addonHandlers";
import { CloneResponse } from "@/app/types/apiResponse";

type ClonePayload = {
  primary: Account;
  clones: Account[];
  addons: AddonData[];
};


export async function POST(req: Request) {
  const { primary, clones, addons }: ClonePayload = await req.json();

  try {
    let primaryAddons: AddonData[] = [];

    // Use user-selected addons if provided
    if (addons.length > 0) {
      primaryAddons = addons;
    } else {
      try {
        const auth = await getAuth(primary);
        primaryAddons = await getAddons(auth);
      } catch (err) {
        if (err instanceof Error) {
          throw new Error(`Primary Account: ${err.message}`);
        }
      }
    }

    const clonedAddons: Record<string, AddonData[]> = {};

    for (const [index, acc] of clones.entries()) {
      try {
        const cloneAuth = await getAuth(acc);
        if (!clonedAddons[cloneAuth]) clonedAddons[cloneAuth] = [];

        if (acc.clone_mode === "append") {
          const existingAddons = await getAddons(cloneAuth);
          clonedAddons[cloneAuth] = [...existingAddons];
        }

        // Loop over primary addons and assign to clone account
        for (const addon of primaryAddons) {
          let current_addon: AddonData = { ...addon };

          // Skip cinemeta in append mode
          if (acc.clone_mode === "append" && addon.manifest.id.includes("cinemeta")) {
            continue;
          }

          // Override debrid keys if applicable
          if (acc.is_debrid_override && addon.manifest.id) {
            current_addon = await handleAddon(addon, acc);
          }

          clonedAddons[cloneAuth].push(current_addon);
        }

      } catch (err) {
        if (err instanceof Error) {
          throw new Error(`Clone Account #${index + 1}: ${err.message}`);
        }
      }
    }

    for (const [authKey, addons] of Object.entries(clonedAddons)) {
      await pushAddonCollection(authKey, addons);
    }

    const response: CloneResponse = {
      success: true,
      message: "Addons cloned successfully",
    };

    return NextResponse.json(response, { status: 200 });
  } catch (err: unknown) {
    console.error("Error cloning addons:", err);

    const response: CloneResponse = {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error occurred",
    };

    return NextResponse.json(response, { status: 200 });
  }
}
