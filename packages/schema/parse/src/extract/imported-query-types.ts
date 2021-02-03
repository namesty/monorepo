import {
  TypeInfo,
  ImportedQueryDefinition,
  createImportedQueryDefinition,
  createMethodDefinition,
} from "../typeInfo";
import {
  extractInputValueDefinition,
  extractListType,
  extractNamedType,
  State,
} from "./query-types-utils";
import { TypeDefinitions } from "./type-definitions";
import { extractImportDirectiveArguments } from "./utils";

import {
  DocumentNode,
  ObjectTypeDefinitionNode,
  NonNullTypeNode,
  NamedTypeNode,
  ListTypeNode,
  FieldDefinitionNode,
  InputValueDefinitionNode,
  visit,
  DirectiveNode,
} from "graphql";

const visitorEnter = (
  importedQueryTypes: ImportedQueryDefinition[],
  state: State,
  typeDefinitions: TypeDefinitions
) => ({
  ObjectTypeDefinition: (node: ObjectTypeDefinitionNode) => {
    if (!node.directives) {
      return;
    }

    // Look for imported
    const importedDirective = "imported";
    const importedIndex = node.directives.findIndex(
      (dir: DirectiveNode) => dir.name.value === importedDirective
    );

    if (importedIndex === -1) {
      return;
    }

    const typeName = node.name.value;

    const queryIdentifier = "_Query";
    const queryTest = typeName.substr(-queryIdentifier.length);
    const mutationIdentifier = "_Mutation";
    const mutationTest = typeName.substr(-mutationIdentifier.length);

    if (queryTest !== queryIdentifier && mutationTest !== mutationIdentifier) {
      // Ignore imported types that aren't query types
      return;
    }

    const directiveArgs = extractImportDirectiveArguments(
      node.directives[importedIndex]
    );
    const importedType = createImportedQueryDefinition({
      type: typeName,
      uri: directiveArgs.uri,
      namespace: directiveArgs.namespace,
      nativeType: directiveArgs.nativeType,
    });
    importedQueryTypes.push(importedType);
    state.currentImport = importedType;
  },
  FieldDefinition: (node: FieldDefinitionNode) => {
    const importDef = state.currentImport;

    if (!importDef) {
      return;
    }

    if (!node.arguments || node.arguments.length === 0) {
      throw Error(
        `Imported Query types must only have methods. See property: ${node.name.value}`
      );
    }

    const method = createMethodDefinition({
      type: importDef.nativeType,
      name: node.name.value,
    });
    importDef.methods.push(method);
    state.currentMethod = method;
  },
  InputValueDefinition: (node: InputValueDefinitionNode) => {
    extractInputValueDefinition(node, state);
  },
  NonNullType: (_node: NonNullTypeNode) => {
    state.nonNullType = true;
  },
  NamedType: (node: NamedTypeNode) => {
    extractNamedType(node, state, typeDefinitions);
  },
  ListType: (_node: ListTypeNode) => {
    extractListType(state);
  },
});

const visitorLeave = (state: State) => ({
  ObjectTypeDefinition: (_node: ObjectTypeDefinitionNode) => {
    state.currentImport = undefined;
  },
  FieldDefinition: (_node: FieldDefinitionNode) => {
    state.currentMethod = undefined;
    state.currentReturn = undefined;
  },
  InputValueDefinition: (_node: InputValueDefinitionNode) => {
    state.currentArgument = undefined;
  },
  NonNullType: (_node: NonNullTypeNode) => {
    state.nonNullType = false;
  },
});

export function extractImportedQueryTypes(
  astNode: DocumentNode,
  typeInfo: TypeInfo,
  typeDefinitions: TypeDefinitions
): void {
  const state: State = {};

  visit(astNode, {
    enter: visitorEnter(typeInfo.importedQueryTypes, state, typeDefinitions),
    leave: visitorLeave(state),
  });
}
