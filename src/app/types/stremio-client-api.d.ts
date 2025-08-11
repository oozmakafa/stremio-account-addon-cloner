// src/types/stremio-api-client.d.ts
declare module 'stremio-api-client' {
  export class StremioAPIStore {
    addons: any[];
    constructor(options?: { authKey?: string });

    login(credentials: { email: string; password: string }): Promise<void>;
    pullAddonCollection(): Promise<void>;
    pushAddonCollection(): Promise<void>;
  }
}
