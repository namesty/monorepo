import { PluginManifest, Uri } from "@namestys/core-js";

export const manifest: PluginManifest = {
  // TODO: use the schema.graphql
  // https://github.com/Web3-API/prototype/issues/101
  schema: "type Query { dummy: String }",
  implemented: [new Uri("w3/api-resolver")],
  imported: [],
};
