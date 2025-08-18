interface ManifestUrlPayload {
    debridService?: string;
    debridApiKey?: string;
}

export function setCometDebridProvider(
    url: string,
    newProvider: string,
    newKey: string
): string {
    try {
        const link = new URL(url);
        const pathParts = link.pathname.split("/").filter(Boolean);

        let payload: ManifestUrlPayload = {};
        const encodedPayload = pathParts[0]; // first part is base64

        if (encodedPayload) {
            try {
                const decoded = Buffer.from(encodedPayload, "base64").toString("utf-8");
                payload = JSON.parse(decoded);
            } catch {
                throw Error("Unable to decode comet configuration");
            }
        }

        // update fields
        payload.debridService = newProvider;
        payload.debridApiKey = newKey;

        // re-encode payload
        const updatedEncoded = Buffer.from(JSON.stringify(payload)).toString("base64");

        return `${link.protocol}//${link.host}/${updatedEncoded}/manifest.json`;
    } catch (err) {
        throw Error(`Failed to override debrid provider for comet: ${err}`)
    }
}
