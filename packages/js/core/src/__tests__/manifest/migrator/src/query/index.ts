import { Ethereum } from "@namestys/wasm-ts";

export function getInformation(): string {
  const res = Ethereum.callView("0x", "function get() view returns (uint256)", "");

  return res;
}
