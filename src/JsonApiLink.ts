import { JsonApiMeta, JsonApiObject } from "@/JsonApiTypes";

export interface LinkObject {
  href: string;
  meta?: JsonApiMeta;
}

export declare type Link = Record<string, string | LinkObject>;

class JsonApiLink implements JsonApiObject {
  protected link: Link;

  constructor(link: Link) {
    this.link = link;
  }

  public getLink(): Link {
    return this.link;
  }

  public setLink(link: Link): this {
    this.link = link;
    return this;
  }

  public static fromJsonApiJson(link?: Link): undefined | JsonApiLink {
    return link ? new JsonApiLink(link) : undefined;
  }

  public toJsonApiJson(): Link {
    return this.link;
  }
}

export declare type RelationshipLink = Record<"self" | "related", LinkObject>;

export class JsonApiRelationshipLink extends JsonApiLink {
  protected link: RelationshipLink;

  constructor(link: RelationshipLink) {
    super(link);
    this.link = link;
  }

  public getLink(): RelationshipLink {
    return this.link;
  }

  public setLink(link: RelationshipLink): this {
    this.link = link;
    return this;
  }
}

export default JsonApiLink;
