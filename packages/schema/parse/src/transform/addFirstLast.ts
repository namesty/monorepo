import { TypeInfoTransforms } from ".";
import {
  MethodDefinition,
  ObjectDefinition,
  QueryDefinition,
  TypeInfo,
  ImportedQueryDefinition,
  EnumDefinition,
  ImportedEnumDefinition,
} from "../typeInfo";

export const addFirstLast: TypeInfoTransforms = {
  enter: {
    TypeInfo: (typeInfo: TypeInfo) => ({
      ...typeInfo,
      enumTypes: setFirstLast(typeInfo.enumTypes),
      objectTypes: setFirstLast(typeInfo.objectTypes),
      queryTypes: setFirstLast(typeInfo.queryTypes),
      importedObjectTypes: setFirstLast(typeInfo.importedObjectTypes),
      importedQueryTypes: setFirstLast(typeInfo.importedQueryTypes),
    }),
    ObjectDefinition: (def: ObjectDefinition) => ({
      ...def,
      properties: setFirstLast(def.properties),
    }),
    EnumDefinition: (def: EnumDefinition) => ({
      ...def,
      properties: setFirstLast(def.values),
    }),
    MethodDefinition: (def: MethodDefinition) => ({
      ...def,
      arguments: setFirstLast(def.arguments),
    }),
    QueryDefinition: (def: QueryDefinition) => ({
      ...def,
      methods: setFirstLast(def.methods),
    }),
    ImportedQueryDefinition: (def: ImportedQueryDefinition) => ({
      ...def,
      methods: setFirstLast(def.methods),
    }),
    ImportedEnumDefinition: (def: ImportedEnumDefinition) => ({
      ...def,
      properties: setFirstLast(def.values),
    }),
  },
};

function setFirstLast<T>(array: T[]): T[] {
  return array.map((item, index) => ({
    ...item,
    first: index === 0 ? true : null,
    last: index === array.length - 1 ? true : null,
  }));
}
