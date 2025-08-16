export type Account = {
    mode: "credentials" | "authkey";
    email: string;
    password: string;
    authkey: string;
    is_debrid_override: boolean;
    debrid_type: string;
    debrid_key: string;
};
