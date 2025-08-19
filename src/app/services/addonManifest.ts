export async function fetchAddonManifest(manifest: string) {
    const res = await fetch(manifest);
    const result = await res.json();

    if (!res.ok) throw new Error(result.statusText || "Unknown error");

    return result;
}