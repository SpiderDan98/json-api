import JsonApiLink, { Link } from "@/JsonApiLink";
import JsonApiRelationship, {
  JsonApiRelationshipJson,
} from "@/JsonApiRelationship";
import {
  JsonApiResourceIdentifier,
  JsonApiResourceIdentifierJson,
} from "@/JsonApiResourceIdentifier";
import { arrayHelper, JsonApiAttribute, NormalData } from "@/JsonApiTypes";

export interface JsonApiResourceJson extends JsonApiResourceIdentifierJson {
  attributes?: JsonApiAttribute;
  relationships?: JsonApiRelationshipJson | JsonApiRelationshipJson[];
  links?: Link;
}

class JsonApiResource extends JsonApiResourceIdentifier {
  protected attributes?: JsonApiAttribute;
  protected relationships?: JsonApiRelationship | JsonApiRelationship[];
  protected links?: JsonApiLink;

  public setAttributes(attributes?: JsonApiAttribute): this {
    this.attributes = attributes;
    return this;
  }

  public getAttributes(): undefined | JsonApiAttribute {
    return this.attributes;
  }

  public addRelationship(
    relationships: JsonApiRelationship | JsonApiRelationship[]
  ): this {
    if (!this.relationships) {
      this.relationships = Array.isArray(relationships)
        ? relationships
        : [relationships];
    }
    if (Array.isArray(this.relationships) && Array.isArray(relationships)) {
      this.relationships = [...this.relationships, ...relationships];
    }
    if (Array.isArray(this.relationships) && !Array.isArray(relationships)) {
      this.relationships.push(relationships);
    }
    return this;
  }

  public setRelationships(
    relationships?: JsonApiRelationship | JsonApiRelationship[]
  ): this {
    this.relationships = relationships;
    return this;
  }

  public getRelationships():
    | undefined
    | JsonApiRelationship
    | JsonApiRelationship[] {
    return this.relationships;
  }

  public getUniqueRelationships():
    | undefined
    | JsonApiRelationship
    | JsonApiRelationship[] {
    if (!Array.isArray(this.relationships)) {
      return this.relationships;
    }
    const seen: any = {};
    return (this.relationships || []).filter((relationship) => {
      const data = relationship.getData();
      if (!data) {
        return true;
      }
      const k = data.getType() + data.getId();
      return seen.hasOwnProperty(k) ? false : (seen[k] = true);
    });
  }

  public setLinks(links?: JsonApiLink): this {
    this.links = links;
    return this;
  }

  public getLinks(): undefined | JsonApiLink {
    return this.links;
  }

  public static fromJsonApiJson(
    json?: JsonApiResourceJson | JsonApiResourceJson[]
  ): undefined | JsonApiResource | JsonApiResource[] {
    return arrayHelper(json, (json) =>
      new JsonApiResource(json.id, json.type)
        .setAttributes(json.attributes)
        .setLinks(JsonApiLink.fromJsonApiJson(json.links))
        .setMeta(json.meta)
        .setRelationships(
          JsonApiRelationship.fromJsonApiJson(json.relationships)
        )
    );
  }

  public toJsonApiJson(): JsonApiResourceJson {
    const json: JsonApiResourceJson = {
      id: this.id,
      type: this.type,
    };

    if (this.attributes) {
      json.attributes = this.attributes;
    }

    const uniqueRelationships = this.getUniqueRelationships();
    if (uniqueRelationships) {
      json.relationships = arrayHelper(uniqueRelationships, (relationship) =>
        relationship.toJsonApiJson()
      );
    }

    if (this.links) {
      json.links = this.links.toJsonApiJson();
    }

    if (this.meta) {
      json.meta = this.meta;
    }

    return json;
  }

  public toJson(): NormalData {
    return {
      id: this.id,
      ...(this.attributes || {}),
    };
  }
}

export default JsonApiResource;
