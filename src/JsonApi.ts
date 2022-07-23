import JsonApiError, { JsonApiErrorJson } from "@/JsonApiError";
import JsonApiLink, { Link } from "@/JsonApiLink";
import JsonApiRelationship from "@/JsonApiRelationship";
import JsonApiResource, { JsonApiResourceJson } from "@/JsonApiResource";
import { JsonApiResourceIdentifier } from "@/JsonApiResourceIdentifier";
import {
  arrayHelper,
  JsonApiAttribute,
  JsonApiJsonApi,
  JsonApiMeta,
  NormalData,
} from "@/JsonApiTypes";

export interface JsonApiJson {
  data?: JsonApiResourceJson | JsonApiResourceJson[];
  errors?: JsonApiErrorJson[];
  meta?: JsonApiMeta;

  jsonapi?: JsonApiJsonApi;
  links?: Link;
  included?: JsonApiResourceJson[];
}

class JsonApi {
  protected type: string;
  protected data?: JsonApiResource | JsonApiResource[];
  protected errors?: JsonApiError[];
  protected meta?: JsonApiMeta;

  protected jsonapi?: JsonApiJsonApi;
  protected links?: JsonApiLink;
  protected included?: JsonApiResource[];

  constructor(type: string = "") {
    this.type = type;
  }

  public fromNormalData(data?: NormalData | NormalData[]): this {
    arrayHelper(data, (normalData) => {
      const [dataItem, included] = this.normalizeData(this.type, normalData);
      this.addData(dataItem);
      included && this.addIncluded(included);
    });

    return this;
  }

  public fromJsonApiData(data: JsonApiJson): this {
    if (data.errors) {
      this.errors = data.errors.map((error) =>
        JsonApiError.fromJsonApiJson(error)
      );
    }

    if (data.jsonapi) {
      this.jsonapi = data.jsonapi;
    }

    if (data.meta) {
      this.meta = data.meta;
    }

    if (data.links) {
      this.links = JsonApiLink.fromJsonApiJson(data.links);
    }

    if (data.included) {
      this.included = JsonApiResource.fromJsonApiJson(
        data.included
      ) as JsonApiResource[];
    }

    if (data.data) {
      this.data = JsonApiResource.fromJsonApiJson(data.data);
    }

    return this;
  }

  private normalizeData(
    type: string,
    { id, ...data }: NormalData
  ): [JsonApiResource, undefined | JsonApiResource[]] {
    const jsonApiResource = new JsonApiResource(id, type);
    let includedApiResource: undefined | JsonApiResource[] = undefined;
    const attributes: JsonApiAttribute = {};

    for (const [key, value] of Object.entries(data)) {
      const isArray = Array.isArray(value);
      const isObject = typeof value === "object" && !isArray;

      if (isObject) {
        const [relationship, included] = this.normalizeData(key, value);
        jsonApiResource.addRelationship(
          new JsonApiRelationship().setData(
            new JsonApiResourceIdentifier(value.id, key)
          )
        );
        includedApiResource = [
          ...(includedApiResource || []),
          relationship,
          ...(included || []),
        ];
      }

      if (isArray && value.length) {
        jsonApiResource.setRelationships([]);
        value.forEach((data) => {
          const [relationship, included] = this.normalizeData(key, data);
          jsonApiResource.addRelationship(
            new JsonApiRelationship().setData(
              new JsonApiResourceIdentifier(data.id, key)
            )
          );
          includedApiResource = [
            ...(includedApiResource || []),
            relationship,
            ...(included || []),
          ];
        });
      }

      if (!isObject && !isArray) {
        attributes[key] = value;
      }
    }
    jsonApiResource.setAttributes(attributes);

    return [jsonApiResource, includedApiResource];
  }

  public getType(): string {
    return this.type;
  }

  public setType(type: string): this {
    this.type = type;
    arrayHelper(this.data, (data) => data.setType(type));
    return this;
  }

  public addData(data: JsonApiResource): this {
    if (!this.data) {
      this.data = [data];
      return this;
    }
    if (Array.isArray(this.data)) {
      this.data.push(data);
    }
    return this;
  }

  public setData(data?: JsonApiResource | JsonApiResource[]): this {
    this.data = data;

    return this;
  }

  public getData(): undefined | JsonApiResource | JsonApiResource[] {
    return this.data;
  }

  public setErrors(errors?: JsonApiError[]): this {
    this.errors = errors;
    return this;
  }

  public getErrors(): undefined | JsonApiError[] {
    return this.errors;
  }

  public setMeta(meta?: JsonApiMeta): this {
    this.meta = meta;
    return this;
  }

  public getMeta(): undefined | JsonApiMeta {
    return this.meta;
  }

  public setJsonApi(jsonapi?: JsonApiJsonApi): this {
    this.jsonapi = jsonapi;
    return this;
  }

  public getJsonApi(): undefined | JsonApiJsonApi {
    return this.jsonapi;
  }

  public setLinks(links?: JsonApiLink): this {
    this.links = links;
    return this;
  }

  public getLinks(): undefined | JsonApiLink {
    return this.links;
  }

  public addIncluded(included: JsonApiResource | JsonApiResource[]): this {
    if (!this.included) {
      this.included = Array.isArray(included) ? included : [included];
      return this;
    }
    if (Array.isArray(included)) {
      this.included = [...this.included, ...included];
    }
    if (!Array.isArray(included)) {
      this.included.push(included);
    }
    return this;
  }

  public setIncluded(included?: JsonApiResource[]): this {
    this.included = included;
    return this;
  }

  public getIncluded(): undefined | JsonApiResource[] {
    return this.included;
  }

  public getUniqueIncluded(): JsonApiResource[] {
    const seen: any = {};
    return (this.included || []).filter((included) => {
      const k = included.getType() + included.getId();
      return seen.hasOwnProperty(k) ? false : (seen[k] = true);
    });
  }

  public toJsonApiJson(): JsonApiJson {
    const json: JsonApiJson = {};

    if (this.jsonapi) {
      json.jsonapi = this.jsonapi;
    }

    if (this.meta) {
      json.meta = this.meta;
    }

    if (this.data) {
      json.data = arrayHelper(this.data, (data: JsonApiResource) =>
        data.toJsonApiJson()
      );
    }

    if (this.errors) {
      json.errors = this.errors.map((error) => error.toJsonApiJson());
    }

    if (this.links) {
      json.links = this.links.toJsonApiJson();
    }

    if (this.included) {
      json.included = this.getUniqueIncluded().map((include) =>
        include.toJsonApiJson()
      );
    }

    return json;
  }

  public toDataJson(): undefined | NormalData | NormalData[] {
    return arrayHelper(this.data, (resource) =>
      this.resolveWithRelationship(resource)
    );
  }

  public toErrorJson(): NormalData {
    return (
      this.errors?.reduce(
        (normalError, error) => error.toDataJson(normalError),
        {}
      ) || {}
    );
  }

  protected resolveWithRelationship(resource: JsonApiResource): NormalData {
    const relationships: NormalData = {};
    const relationshipIdentifier = resource.getUniqueRelationships();

    arrayHelper(relationshipIdentifier, (relationshipIdentifier) => {
      const data = relationshipIdentifier.getData();
      if (!data) {
        return;
      }
      const relationshipResource = (this.included || []).find(
        (included) =>
          included.getId() === data.getId() &&
          included.getType() === data.getType()
      );

      if (!relationshipResource) {
        return;
      }

      relationships[data.getType()] = [
        ...(relationships[data.getType()] || []),
        this.resolveWithRelationship(relationshipResource),
      ];
    });

    return {
      ...resource.toJson(),
      ...relationships,
    };
  }
}

export default JsonApi;
