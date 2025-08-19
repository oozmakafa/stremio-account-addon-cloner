

interface AddonFlags {
    protected: boolean;
    official: boolean;
}

interface BehaviorHints {
    configurable: boolean;
}

interface AddonManifest {
    id: string;
    name: string;
    behaviorHints: BehaviorHints;

}

export interface AddonData {
    flags: AddonFlags;
    manifest: AddonManifest;
    transportUrl: string;
    transportName: string;
}

export interface Addon {
    id: string;
    name: string;
    is_protected: boolean;
    is_configurable: boolean;
    checked: boolean;
    addon: AddonData;
};
