import { JsonApiMeta, JsonApiObject } from "@/JsonApiTypes";

export interface JsonApiResourceIdentifierJson {
  id: string;
  type: string;
  meta?: JsonApiMeta;
}

export class JsonApiResourceIdentifier implements JsonApiObject {
  protected id: string;
  protected type: string;
  protected meta?: JsonApiMeta;

  constructor(id: string, type: string) {
    this.id = id;
    this.type = type;
  }

  public setId(id: string): this {
    this.id = id;
    return this;
  }

  public getId(): string {
    return this.id;
  }

  public setType(type: string): this {
    this.type = type;
    return this;
  }

  public getType(): string {
    return this.type;
  }

  public setMeta(meta?: JsonApiMeta): this {
    this.meta = meta;
    return this;
  }

  public getMeta(): undefined | JsonApiMeta {
    return this.meta;
  }

  public toJsonApiJson(): JsonApiResourceIdentifierJson {
    const json: JsonApiResourceIdentifierJson = {
      id: this.id,
      type: this.type,
    };

    if (this.meta) {
      json.meta = this.meta;
    }

    return json;
  }
}
