import { Account } from "../types/accounts";

export function validatePrimaryAccount(
    primaryAccount: Account
): { valid: boolean; error?: string } {
    if (primaryAccount.mode === "credentials") {
        if (!primaryAccount.email || !primaryAccount.password) {
            return { valid: false, error: "Primary account email and password are required." };
        }
    } else if (primaryAccount.mode === "authkey") {
        if (!primaryAccount.authkey) {
            return { valid: false, error: "Primary account auth key is required." };
        }
    }
    return { valid: true };
}

export function validateCloneAccounts(cloneAccounts: Account[]) {
    for (let i = 0; i < cloneAccounts.length; i++) {
        const acc = cloneAccounts[i];
        if (acc.mode === "credentials") {
            if (!acc.email || !acc.password) {
                return {
                    valid: false,
                    error: `Clone account #${i + 1}: Email and password are required.`,
                };
            }
        } else if (acc.mode === "authkey") {
            if (!acc.authkey) {
                return { valid: false, error: `Clone account #${i + 1}: Auth key is required.` };
            }
        }
    }
    return { valid: true };
}
