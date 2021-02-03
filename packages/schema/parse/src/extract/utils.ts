import {
  createEnumDefinition,
  createObjectDefinition,
  createScalarDefinition,
  isScalarType,
  PropertyDefinition,
} from "../typeInfo";
import { isEnumType } from "../typeInfo/enum";
import { isObjectType } from "../typeInfo/object";
import { TypeDefinitions } from "./type-definitions";

import { DirectiveNode, ValueNode } from "graphql";

export function setPropertyType(
  property: PropertyDefinition,
  name: string,
  type: { type: string; required: boolean | undefined },
  typeDefinitions: TypeDefinitions
): void {
  if (isScalarType(type.type)) {
    property.scalar = createScalarDefinition({
      name: name,
      type: type.type,
      required: type.required,
    });
  } else if (isEnumType(type.type, typeDefinitions.enumTypes)) {
    property.enum = createEnumDefinition({
      name: name,
      type: type.type,
      required: type.required,
    });
  } else if (isObjectType(type.type, typeDefinitions.objectTypes)) {
    property.object = createObjectDefinition({
      name: name,
      type: type.type,
      required: type.required,
    });
  } else {
    throw new Error(`Unsupported type ${type.type}`);
  }
}

export function extractImportDirectiveArguments(
  importedDir: DirectiveNode
): {
  uri: string;
  namespace: string;
  nativeType: string;
} {
  if (!importedDir.arguments || importedDir.arguments.length !== 3) {
    // TODO: Implement better error handling
    // https://github.com/Web3-API/prototype/issues/15
    throw Error("Error: imported directive missing arguments");
  }

  let namespace: string | undefined;
  let uri: string | undefined;
  let nativeType: string | undefined;

  const extractString = (value: ValueNode, name: string) => {
    if (value.kind === "StringValue") {
      return value.value;
    } else {
      throw Error(`Error: argument '${name}' must be a string`);
    }
  };

  for (const importArg of importedDir.arguments) {
    if (importArg.name.value === "namespace") {
      namespace = extractString(importArg.value, "namespace");
    } else if (importArg.name.value === "uri") {
      uri = extractString(importArg.value, "uri");
    } else if (importArg.name.value === "type") {
      nativeType = extractString(importArg.value, "type");
    }
  }

  if (!nativeType || !namespace || !uri) {
    throw Error(
      "Error: import directive missing one of its required arguments (namespace, uri, type)"
    );
  }

  return {
    uri: uri,
    namespace: namespace,
    nativeType: nativeType,
  };
}
