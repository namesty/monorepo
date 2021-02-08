import {
  w3_subinvoke,
  Nullable
} from "@namestys/wasm-as";
import {
  serializeimportedMethodArgs,
  deserializeimportedMethodResult,
  Input_importedMethod,
  serializeanotherMethodArgs,
  deserializeanotherMethodResult,
  Input_anotherMethod
} from "./serialization";

export class TestImport_Query {

  public static uri: string = "testimport.uri.eth";

  public static importedMethod(input: Input_importedMethod): string {
    const args = serializeimportedMethodArgs(input);
    const result = w3_subinvoke(
      "testimport.uri.eth",
      "query",
      "importedMethod",
      args
    );
    return deserializeimportedMethodResult(result);
  }

  public static anotherMethod(input: Input_anotherMethod): i64 {
    const args = serializeanotherMethodArgs(input);
    const result = w3_subinvoke(
      "testimport.uri.eth",
      "query",
      "anotherMethod",
      args
    );
    return deserializeanotherMethodResult(result);
  }
}
