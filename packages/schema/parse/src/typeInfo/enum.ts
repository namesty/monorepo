import { EnumDefinition } from "./definitions";

export function isEnumType(type: string, enumTypes: EnumDefinition[]): boolean {
  const index = enumTypes.findIndex(
    (item: EnumDefinition) => type === item.type
  );

  return index === -1 ? false : true;
}
