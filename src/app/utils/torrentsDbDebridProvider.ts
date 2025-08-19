import { DEBRID_OPTIONS } from "./debridOptions";

interface ManifestUrlPayload {
    torbox?: string;
    realdebrid?: string;
    offcloud?: string;
    alldebrid?: string;
    easydebrid?: string;
    premiunize?: string;
    [key: string]: Record<string, string> | string | undefined;
}

export function setTorrentsDbDebridProvider(
    url: string,
    newProvider: string,
    newKey: string
): string {
    try {
        const link = new URL(url);
        const pathParts = link.pathname.split("/").filter(Boolean);

        let payload: ManifestUrlPayload = {};
        const encodedPayload = pathParts[0]; // first part is base64

        if (encodedPayload && encodedPayload !== "manifest.json") {
            try {
                const decoded = Buffer.from(encodedPayload, "base64").toString("utf-8");
                payload = JSON.parse(decoded);
                // Remove all existing debrid keys
                Object.keys(payload).forEach((key) => {
                    if (DEBRID_OPTIONS.some(debrid => key == debrid.value)) {
                        delete payload[key];
                    }
                });
            } catch {
                throw Error("Unable to decode torrentsDb configuration");
            }
        }

        // update fields
        payload[newProvider] = newKey;

        // re-encode payload
        const updatedEncoded = Buffer.from(JSON.stringify(payload)).toString("base64");

        return `${link.protocol}//${link.host}/${updatedEncoded}/manifest.json`;
    } catch (err) {
        throw Error(`Failed to override debrid provider for torrentsDb: ${err}`)
    }
}
