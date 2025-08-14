export type Account = {
    mode: "credentials" | "authkey";
    email: string;
    password: string;
    authkey: string;
};
