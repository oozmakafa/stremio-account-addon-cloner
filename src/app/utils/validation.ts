import { Account } from "../types/accounts";



export function validateAccount(
    account: Account,
    accountType: string
): { valid: boolean; error?: string } {
    if (account.mode === "credentials") {
        if (!account.email || !account.password) {
            return { valid: false, error: `${accountType} account email and password are required.` };
        }
    } else if (account.mode === "authkey") {
        if (!account.authkey) {
            return { valid: false, error: `${accountType} account auth key is required.` };
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


        if (acc.is_debrid_override && (!acc.debrid_type || !acc.debrid_key)) {
            return { valid: false, error: `Clone account #${i + 1}: Debrid Override is required.` };
        }

    }
    return { valid: true };
}
