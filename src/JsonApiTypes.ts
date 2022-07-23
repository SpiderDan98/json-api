import { JsonApiResourceIdentifier } from "@/JsonApiResourceIdentifier";

export interface JsonApiObject {
  toJsonApiJson(): Record<string, any>;
}

export declare type JsonApiResourceLinkage = null | JsonApiResourceIdentifier;
export declare type JsonApiMeta = Record<string, any>;
export declare type JsonApiAttribute = Record<string, any>;
export declare type JsonApiJsonApi = Record<string, any>;
export declare type NormalData = Record<string, any>;

export const arrayHelper = (
  array: undefined | any | any[],
  fn: (arrayItem: any) => any
) => {
  if (Array.isArray(array)) {
    return array.map(fn);
  }

  if (array !== undefined) {
    return fn(array);
  }

  return undefined;
};
