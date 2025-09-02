"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { Account } from "../types/accounts";
import { Addon } from "../types/addon";


type AlertState = { type: "success" | "error"; message: string } | null;

type AccountsContextType = {
    primaryAccount: Account;
    setPrimaryAccount: React.Dispatch<React.SetStateAction<Account>>;
    cloneAccounts: Account[];
    setCloneAccounts: React.Dispatch<React.SetStateAction<Account[]>>;
    rememberDetails: boolean;
    setRememberDetails: React.Dispatch<React.SetStateAction<boolean>>;
    addAccount: () => void;
    removeAccount: (index: number) => void;

    // addon-related state
    addons: Addon[];
    setAddons: (addons: Addon[]) => void;


    // Alert state
    alert: AlertState;
    setAlert: React.Dispatch<React.SetStateAction<AlertState>>;
};

const AccountsContext = createContext<AccountsContextType | undefined>(undefined);

export const AccountsProvider = ({ children }: { children: React.ReactNode }) => {
    // --- account state ---
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
            mode: "credentials",
            email: "",
            password: "",
            authkey: "",
            is_debrid_override: false,
            debrid_type: "",
            debrid_key: "",
            clone_mode: "sync",
            selected: true,
        }
    ]);

    const [rememberDetails, setRememberDetails] = useState(false);
    // --- addon state ---
    const [addons, setAddons] = useState<Addon[]>([]);

    // Alert state
    const [alert, setAlert] = useState<AlertState>(null);


    // Load from localStorage on mount
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

    const addAccount = () =>
        setCloneAccounts([
            ...cloneAccounts,
            {
                mode: "credentials",
                email: "",
                password: "",
                authkey: "",
                is_debrid_override: false,
                debrid_type: "",
                debrid_key: "",
                clone_mode: "sync",
                selected: true,
            }
        ]);

    const removeAccount = (index: number) =>
        setCloneAccounts(cloneAccounts.filter((_, i) => i !== index));



    return (
        <AccountsContext.Provider
            value={{
                primaryAccount,
                setPrimaryAccount,
                cloneAccounts,
                setCloneAccounts,
                rememberDetails,
                setRememberDetails,
                addAccount,
                removeAccount,
                // expose addons state
                addons,
                setAddons,
                // alert state
                alert,
                setAlert,
            }}
        >
            {children}
        </AccountsContext.Provider>
    );
};

export const useAccounts = () => {
    const ctx = useContext(AccountsContext);
    if (!ctx) throw new Error("useAccounts must be used within AccountsProvider");
    return ctx;
};
