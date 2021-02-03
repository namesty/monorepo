import {
  TypeInfo,
  createImportedEnumDefinition,
  ImportedEnumDefinition,
} from "../typeInfo";
import { extractImportDirectiveArguments } from "./utils";

import {
  DirectiveNode,
  DocumentNode,
  EnumTypeDefinitionNode,
  visit,
} from "graphql";

const visitorEnter = (importedEnumTypes: ImportedEnumDefinition[]) => ({
  EnumTypeDefinition: (node: EnumTypeDefinitionNode) => {
    if (!node.directives) {
      return;
    }

    // Look for imported
    const importedIndex = node.directives.findIndex(
      (dir: DirectiveNode) => dir.name.value === "imported"
    );

    if (importedIndex === -1) {
      return;
    }

    const values: string[] = [];
    if (node.values) {
      for (const value of node.values) {
        values.push(value.name.value);
      }
    }

    const directiveArgs = extractImportDirectiveArguments(
      node.directives[importedIndex]
    );
    const enumType = createImportedEnumDefinition({
      type: node.name.value,
      values: values,
      uri: directiveArgs.uri,
      namespace: directiveArgs.namespace,
      nativeType: directiveArgs.nativeType,
    });
    importedEnumTypes.push(enumType);
  },
});

export function extractImportedEnumTypes(
  astNode: DocumentNode,
  typeInfo: TypeInfo
): void {
  visit(astNode, {
    enter: visitorEnter(typeInfo.importedEnumTypes),
  });
}
