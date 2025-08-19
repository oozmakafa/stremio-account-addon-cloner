import { AddonData } from "./addon";

export type AddonsResponse =
    | { success: true; addons: AddonData[] }
    | { success: false; addons: []; error: string };

export type CloneResponse =
    | { success: true; message: string }
    | { success: false; error: string };