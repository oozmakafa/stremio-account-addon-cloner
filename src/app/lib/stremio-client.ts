const makeRequest = async (options: { path: string, params: object }) => {
    const res = await fetch(`https://api.strem.io/api/${options.path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(options.params),
    });

    const result = await res.json();
    if (!res.ok || result.error) {
        const message = `Issue occurred during ${options.path}: ${JSON.stringify(result.error) || "Unknown error"}`
        throw new Error(message);
    }

    return result;
}

const login = async (email: string, password: string) => {
    return makeRequest({ path: "login", params: { email, password } });
}

const pullAddonCollection = async (authKey: string) => {
    return makeRequest({ path: "addonCollectionGet", params: { authKey } });
}

const pushAddonCollection = async (authKey: string, addons: object[]) => {
    return makeRequest({ path: "addonCollectionSet", params: { authKey, addons } });
}

export { login, pullAddonCollection, pushAddonCollection };