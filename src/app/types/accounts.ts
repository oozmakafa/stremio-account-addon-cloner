export type Account = {
    mode: "credentials" | "authkey";
    email: string;
    password: string;
    authkey: string;
    debrid_type?: string;
    debrid_key?: string;
};
