import type { NextApiRequest, NextApiResponse } from 'next';
import { StremioAPIStore } from 'stremio-api-client';


type CloneAccount = {
  mode: 'credentials' | 'authkey';
  email: string;
  password: string;
  authkey: string;
};

type ClonePayload = {
  primary: CloneAccount;
  clones: CloneAccount[];
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { primary, clones }: ClonePayload = req.body;

  const createStore = (auth: CloneAccount) => {
    const opts: any = {};
    if (auth.mode === 'authkey') opts.authKey = auth.authkey;
    return new StremioAPIStore(opts);
  };

  try {
    // Primary account store
    const primaryStore = createStore(primary);
    if (primary.mode === 'credentials') {
      await primaryStore.login({ email: primary.email, password: primary.password });
    }

    // Fetch primary addons
    await primaryStore.pullAddonCollection();
    const primaryAddons = primaryStore.addons;

    // Push to each clone account
    for (const acc of clones) {
      const cloneStore = createStore(acc);
      if (acc.mode === 'credentials') {
        await cloneStore.login({ email: acc.email, password: acc.password });
      }
      cloneStore.addons = primaryAddons; // sync state
      await cloneStore.pushAddonCollection();
    }

    res.status(200).json({ message: 'Addons cloned successfully' });
  } catch (err: any) {
    console.error('Error cloning addons:', err);
    res.status(500).json({ error: 'Failed to clone addons', details: err.message });
  }
}
