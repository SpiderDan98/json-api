import JsonApiLink, { JsonApiRelationshipLink, Link } from "@/JsonApiLink";
import {
  JsonApiResourceIdentifier,
  JsonApiResourceIdentifierJson,
} from "@/JsonApiResourceIdentifier";
import {
  arrayHelper,
  JsonApiMeta,
  JsonApiObject,
  JsonApiResourceLinkage,
} from "@/JsonApiTypes";

export interface JsonApiRelationshipJson {
  links?: Link;
  data?: null | JsonApiResourceIdentifierJson;
  meta?: JsonApiMeta;
}

class JsonApiRelationship implements JsonApiObject {
  protected links?: JsonApiRelationshipLink;
  protected data?: JsonApiResourceLinkage;
  protected meta?: JsonApiMeta;

  public setLinks(links?: JsonApiRelationshipLink): this {
    this.links = links;
    return this;
  }

  public getLinks(): undefined | JsonApiRelationshipLink {
    return this.links;
  }

  public setData(data?: JsonApiResourceLinkage): this {
    this.data = data;
    return this;
  }

  public getData(): undefined | JsonApiResourceLinkage {
    return this.data;
  }

  public setMeta(meta?: JsonApiMeta): this {
    this.meta = meta;
    return this;
  }

  public getMeta(): undefined | JsonApiMeta {
    return this.meta;
  }

  public static fromJsonApiJson(
    json?: JsonApiRelationshipJson | JsonApiRelationshipJson[]
  ): undefined | JsonApiRelationship {
    return arrayHelper(json, (relationship) =>
      new JsonApiRelationship()
        .setData(
          new JsonApiResourceIdentifier(
            relationship.data.id,
            relationship.data.type
          )
        )
        .setLinks(
          JsonApiLink.fromJsonApiJson(
            relationship.links
          ) as JsonApiRelationshipLink
        )
        .setMeta(relationship.meta)
    );
  }

  public toJsonApiJson(): JsonApiRelationshipJson {
    const json: JsonApiRelationshipJson = {};

    if (this.links) {
      json.links = this.links.toJsonApiJson();
    }

    if (this.data) {
      json.data = this.data.toJsonApiJson();
    }

    if (this.meta) {
      json.meta = this.meta;
    }

    return json;
  }
}

export default JsonApiRelationship;
