import { TypeInfo, EnumDefinition, createEnumDefinition } from "../typeInfo";

import { DocumentNode, EnumTypeDefinitionNode, visit } from "graphql";

const visitorEnter = (enumTypes: EnumDefinition[]) => ({
  EnumTypeDefinition: (node: EnumTypeDefinitionNode) => {
    const values: string[] = [];
    if (node.values) {
      for (const value of node.values) {
        values.push(value.name.value);
      }
    }

    const enumType = createEnumDefinition({
      type: node.name.value,
      values: values,
    });
    enumTypes.push(enumType);
  },
});

export function extractEnumTypes(
  astNode: DocumentNode,
  typeInfo: TypeInfo
): void {
  visit(astNode, {
    enter: visitorEnter(typeInfo.enumTypes),
  });
}
