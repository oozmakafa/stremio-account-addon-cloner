import { Account } from "../types/accounts";

export async function fetchAddons(primaryAccount: Account) {
    const res = await fetch("/api/addons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(primaryAccount),
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.details || "Unknown error");
    return result.addons;
}

export async function cloneAddons(
    primaryAccount: Account,
    cloneAccounts: Account[],
    addons: object[]
) {
    const data = JSON.stringify({
        primary: primaryAccount,
        clones: cloneAccounts,
        addons,
    });

    const res = await fetch("/api/clone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: data,
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.details || "Unknown error");
    return result;
}
