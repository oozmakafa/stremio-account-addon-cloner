
import { NextResponse } from "next/server";
import { Account } from "@/app/types/accounts";
import { pushAddonCollection, getAuth, getAddons } from "@/app/lib/stremio-client";
import { setTorrentDebridProvider } from "@/app/utils/torrentioDebridProvider";
import { fetchAddonManifest } from "@/app/services/addonManifest";

interface ManifestData {
  id: string;
}

interface AddonData {
  flags: object;
  manifest: ManifestData;
  transportUrl: string;
}

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
        clonedAddons[cloneAuth] = []; // initialize array for this clone

        for (const addon of primaryAddons) {
          let current_addon: AddonData = { ...addon };

          if (!clonedAddons[cloneAuth]) {
            clonedAddons[cloneAuth] = [];
          }

          // Check if addon already exists
          const exists = clonedAddons[cloneAuth].some(
            (addonData) => addonData.manifest.id === addon.manifest.id
          );

          if (
            !exists &&
            acc.is_debrid_override &&
            addon?.manifest?.id == "com.stremio.torrentio.addon"

          ) {
            const new_transport = setTorrentDebridProvider(
              addon?.transportUrl,
              acc.debrid_type,
              acc.debrid_key
            );
            const new_manifest = await fetchAddonManifest(new_transport);

            current_addon = {
              ...addon,
              transportUrl: new_transport,
              manifest: new_manifest,
            };
          }

          // push into the correct cloneAuth bucket
          clonedAddons[cloneAuth].push(current_addon);
        }

        for (const [authKey, addons] of Object.entries(clonedAddons)) {
          // await pushAddonCollection(authKey, addons);
          console.log("test");
        }

        // push all addons for this clone
        // await pushAddonCollection(cloneAuth, clonedAddons[cloneAuth]);
      } catch (err) {
        if (err instanceof Error) {
          throw Error(`Clone Account # ${index + 1}: ${err.message}`);
        }
      }
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
