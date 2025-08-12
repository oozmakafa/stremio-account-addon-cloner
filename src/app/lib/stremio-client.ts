const makeRequest = async (options: { path: string, params: any }) => {
    const res = await fetch(`https://api.strem.io/api/${options.path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(options.params),
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "Unknown error");

    return result;
}

const login = async (email: string, password: string) => {
    return makeRequest({ path: "login", params: { email, password } });
}

const pullAddonCollection = async (authKey: string) => {
    return makeRequest({ path: "addonCollectionGet", params: { authKey } });
}

const pushAddonCollection = async (authKey: string, addons: any[]) => {
    return makeRequest({ path: "addonCollectionSet", params: { authKey, addons } });
}

export { login, pullAddonCollection, pushAddonCollection };