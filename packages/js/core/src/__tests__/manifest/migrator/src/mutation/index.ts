import { Ethereum } from "@namestys/wasm-ts";

export function setInformation(): string {
  return Ethereum.sendTransaction("0x", "myMethod", "");
}
