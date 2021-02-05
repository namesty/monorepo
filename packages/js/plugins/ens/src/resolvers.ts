import { EnsPlugin } from "./";

import { Client, PluginModule } from "@namestyorg/core-js";

export const query = (ens: EnsPlugin, client: Client): PluginModule => ({
  // w3/api-resolver
  tryResolveUri: async (input: { authority: string; path: string }) => {
    if (input.authority !== "ens") {
      return null;
    }

    try {
      return {
        uri: `ipfs/${await ens.ensToCID(input.path, client)}`,
        manifest: null,
      };
    } catch (e) {
      // TODO: logging https://github.com/Web3-API/prototype/issues/33
    }

    // Nothing found
    return { uri: null, manifest: null };
  },
  getFile: (_input: { path: string }) => {
    return null;
  },
});
