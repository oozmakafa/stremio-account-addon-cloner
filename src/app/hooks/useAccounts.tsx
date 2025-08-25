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
        clone_mode: "sync"
    });

    const [cloneAccounts, setCloneAccounts] = useState<Account[]>([
        {
            mode: "credentials", email: "", password: "", authkey: "",
            is_debrid_override: false,
            debrid_type: "",
            debrid_key: "",
            clone_mode: "sync"
        },
    ]);

    const [rememberDetails, setRememberDetails] = useState(false);

    // Load accounts from localStorage
    useEffect(() => {
        const saved = localStorage.getItem("stremio_acounts_v1");
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                const decodedPrimary = atob(parsed.primary);
                const decodedClones = atob(parsed.clones);
                setPrimaryAccount(JSON.parse(decodedPrimary));
                setCloneAccounts(JSON.parse(decodedClones));
                setRememberDetails(true);
            } catch (err) {
                console.error("Failed to load saved accounts:", err);
            }
        }
    }, []);

    const saveToLocalStorage = () => {
        if (!rememberDetails) {
            localStorage.removeItem("stremio_acounts_v1");
            return;
        }
        const encodedPrimary = btoa(JSON.stringify(primaryAccount));
        const encodedClones = btoa(JSON.stringify(cloneAccounts));

        localStorage.setItem(
            "stremio_acounts_v1",
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
                debrid_key: "",
                clone_mode: "sync"
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

    const handleBulkChange = (checked: boolean) => {
        setCloneAccounts(prev => prev.map(acc => ({ ...acc, selected: checked })));
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
        handleBulkChange
    };
}
