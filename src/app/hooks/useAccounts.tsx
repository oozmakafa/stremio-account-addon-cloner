"use client";
import { useState, useEffect } from "react";
import { Account } from "../types/accounts";

export function useAccounts() {
    const [primaryAccount, setPrimaryAccount] = useState<Account>({
        mode: "credentials",
        email: "",
        password: "",
        authkey: "",
        is_debrid_override: false,
        debrid_type: "",
        debrid_key: "",
    });

    const [cloneAccounts, setCloneAccounts] = useState<Account[]>([
        {
            mode: "credentials", email: "", password: "", authkey: "",
            is_debrid_override: false,
            debrid_type: "",
            debrid_key: ""
        },
    ]);

    const [rememberDetails, setRememberDetails] = useState(false);

    // Load accounts from localStorage
    useEffect(() => {
        const saved = localStorage.getItem("stremio_clone_accounts");
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setPrimaryAccount({
                    ...parsed.primary,
                    password:
                        parsed.primary.mode === "credentials"
                            ? atob(parsed.primary.password || "")
                            : "",
                });
                setCloneAccounts(
                    parsed.clones.map((acc: Account) => ({
                        ...acc,
                        password: acc.mode === "credentials" ? atob(acc.password || "") : "",
                    }))
                );
                setRememberDetails(true);
            } catch (err) {
                console.error("Failed to load saved accounts:", err);
            }
        }
    }, []);

    const saveToLocalStorage = () => {
        if (!rememberDetails) {
            localStorage.removeItem("stremio_clone_accounts");
            return;
        }
        const encodedPrimary = {
            ...primaryAccount,
            password:
                primaryAccount.mode === "credentials"
                    ? btoa(primaryAccount.password || "")
                    : "",
        };
        const encodedClones = cloneAccounts.map((acc) => ({
            ...acc,
            password: acc.mode === "credentials" ? btoa(acc.password || "") : "",
        }));
        localStorage.setItem(
            "stremio_clone_accounts",
            JSON.stringify({ primary: encodedPrimary, clones: encodedClones })
        );
    };

    const addAccount = () =>
        setCloneAccounts([
            ...cloneAccounts,
            {
                mode: "credentials", email: "", password: "", authkey: "",
                is_debrid_override: false,
                debrid_type: "",
                debrid_key: ""
            },
        ]);

    const removeAccount = (index: number) =>
        setCloneAccounts(cloneAccounts.filter((_, i) => i !== index));

    const handleCloneChange = (index: number, field: keyof Account, value: string | boolean) => {
        const updated = [...cloneAccounts];
        updated[index] = { ...updated[index], [field]: value };
        setCloneAccounts(updated);
    };

    const handlePrimaryChange = (field: keyof Account, value: string) => {
        setPrimaryAccount({ ...primaryAccount, [field]: value });
    };

    return {
        primaryAccount,
        setPrimaryAccount,
        cloneAccounts,
        setCloneAccounts,
        rememberDetails,
        setRememberDetails,
        addAccount,
        removeAccount,
        handleCloneChange,
        handlePrimaryChange,
        saveToLocalStorage,
    };
}
