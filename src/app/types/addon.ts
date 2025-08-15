export type Addon = {
    id: string;
    name: string;
    is_protected: boolean;
    is_configurable: boolean;
    checked: boolean;
    addon: object;
};