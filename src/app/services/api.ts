import { Account } from "../types/accounts";
import { AddonData } from "../types/addon";
import { AddonsResponse } from "../types/apiResponse";

export async function fetchAddons(account: Account) {
    const res = await fetch("/api/addons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(account),
    });

    const result: AddonsResponse = await res.json();
    if (!result.success) throw new Error(result?.error || "Unknown error");
    return result.addons;
}

export async function cloneAddons(
    primaryAccount: Account,
    cloneAccounts: Account[],
    addons: AddonData[]
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
    if (!result.success) throw new Error(result?.error || "Unknown error");
    return result;
}

export async function updateAddons(
    account: Account,
    updatedAddons: AddonData[]
) {
    const data = JSON.stringify({
        account: account,
        addons: updatedAddons
    });

    const res = await fetch("/api/updateAddons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: data,
    });

    const result = await res.json();
    if (!result.success) throw new Error(result?.error || "Unknown error");
    return result;
}

