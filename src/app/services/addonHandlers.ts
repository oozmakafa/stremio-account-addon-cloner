import { Account } from "../types/accounts";
import { AddonData } from "../types/addon";
import { setCometDebridProvider } from "../utils/cometDebridProvider";
import { setJacketDebridProvider } from "../utils/jacketDebridProvider";
import { setTorrentDebridProvider } from "../utils/torrentioDebridProvider";
import { setTorrentsDbDebridProvider } from "../utils/torrentsDbDebridProvider";
import { fetchAddonManifest } from "./addonManifest";

// Define handler config using substrings
const addonHandlers: Record<
    string, // substring to match in manifest.id
    (addon: AddonData, acc: Account) => Promise<AddonData>
> = {
    "torrentio": async (addon, acc) => {
        const newTransport = setTorrentDebridProvider(
            addon.transportUrl,
            acc.debrid_type,
            acc.debrid_key
        );
        const newManifest = await fetchAddonManifest(newTransport);

        return { ...addon, transportUrl: newTransport, manifest: newManifest };
    },

    "comet": async (addon, acc) => {
        const newTransport = setCometDebridProvider(
            addon.transportUrl,
            acc.debrid_type,
            acc.debrid_key
        );
        const newManifest = await fetchAddonManifest(newTransport);

        return { ...addon, transportUrl: newTransport, manifest: newManifest };
    },

    "jackettio": async (addon, acc) => {
        const newTransport = setJacketDebridProvider(
            addon.transportUrl,
            acc.debrid_type,
            acc.debrid_key
        );
        const newManifest = await fetchAddonManifest(newTransport);

        return { ...addon, transportUrl: newTransport, manifest: newManifest };
    },


    "torrentsdb": async (addon, acc) => {
        const newTransport = setTorrentsDbDebridProvider(
            addon.transportUrl,
            acc.debrid_type,
            acc.debrid_key
        );
        const newManifest = await fetchAddonManifest(newTransport);

        return { ...addon, transportUrl: newTransport, manifest: newManifest };
    },
};

// Helper to find a matching handler based on contains
export async function handleAddon(addon: AddonData, acc: Account): Promise<AddonData> {
    const id = addon.manifest.id || "";
    for (const key in addonHandlers) {
        if (id.includes(key)) {
            const handler = addonHandlers[key];
            return await handler(addon, acc);
        }
    }
    // No matching handler, return addon unchanged
    return addon;
}

export { addonHandlers };
