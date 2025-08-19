const DEBRID_PROVIDERS = ["torbox", "realdebrid", "offcloud"];

export function setTorrentDebridProvider(
    url: string,
    newProvider: string,
    newKey: string
): string {
    try {
        if (!url.endsWith("/manifest.json")) return url;

        const base = url.replace("/manifest.json", "");
        const decoded = decodeURIComponent(base.split(".fun/")[1] || "");

        const parts = decoded.split("|").filter(Boolean);

        const filtered = parts.filter(
            (p) => !DEBRID_PROVIDERS.some((prov) => p.startsWith(`${prov}=`))
        );

        filtered.push(`${newProvider}=${newKey}`);

        const rebuilt = encodeURIComponent(filtered.join("|"));
        return `https://torrentio.strem.fun/${rebuilt}/manifest.json`;
    } catch (err) {
        throw Error(`Failed to override debrid provider for torrentio: ${err}`)
    }
}
