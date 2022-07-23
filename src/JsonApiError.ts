import JsonApiLink from "./JsonApiLink";
import { JsonApiMeta, JsonApiObject, NormalData } from "./JsonApiTypes";

export interface JsonApiErrorSource {
  pointer?: string;
  parameter?: string;
}

export interface JsonApiErrorJson {
  id?: string;
  links?: JsonApiLink;
  status?: string;
  code?: string;
  title?: string;
  detail?: string;
  source?: JsonApiErrorSource;
  meta?: JsonApiMeta;
}

class JsonApiError implements JsonApiObject {
  protected id?: string;
  protected links?: JsonApiLink;
  protected status?: string;
  protected code?: string;
  protected title?: string;
  protected detail?: string;
  protected source?: JsonApiErrorSource;
  protected meta?: JsonApiMeta;

  public setId(id?: string): this {
    this.id = id;
    return this;
  }

  public getId(): undefined | string {
    return this.id;
  }

  public setLinks(links?: JsonApiLink): this {
    this.links = links;
    return this;
  }

  public getLinks(): undefined | JsonApiLink {
    return this.links;
  }

  public setStatus(status?: string): this {
    this.status = status;
    return this;
  }

  public getStatus(): undefined | string {
    return this.status;
  }

  public setCode(code?: string): this {
    this.code = code;
    return this;
  }

  public getCode(): undefined | string {
    return this.code;
  }

  public setTitle(title?: string): this {
    this.title = title;
    return this;
  }

  public getTitle(): undefined | string {
    return this.title;
  }

  public setDetail(detail?: string): this {
    this.detail = detail;
    return this;
  }

  public getDetail(): undefined | string {
    return this.detail;
  }

  public setSource(source?: JsonApiErrorSource): this {
    this.source = source;
    return this;
  }

  public getSource(): undefined | JsonApiErrorSource {
    return this.source;
  }

  public setMeta(meta?: JsonApiMeta): this {
    this.meta = meta;
    return this;
  }

  public getMeta(): undefined | JsonApiMeta {
    return this.meta;
  }

  public static fromJsonApiJson(json: JsonApiErrorJson): JsonApiError {
    return new JsonApiError()
      .setCode(json.code)
      .setDetail(json.detail)
      .setId(json.id)
      .setLinks(json.links)
      .setMeta(json.meta)
      .setSource(json.source)
      .setStatus(json.status)
      .setTitle(json.title);
  }

  public toJsonApiJson(): JsonApiErrorJson {
    const json: JsonApiErrorJson = {};

    if (this.id) {
      json.id = this.id;
    }

    if (this.links) {
      json.links = this.links;
    }

    if (this.status) {
      json.status = this.status;
    }

    if (this.code) {
      json.code = this.code;
    }

    if (this.title) {
      json.title = this.title;
    }

    if (this.detail) {
      json.detail = this.detail;
    }

    if (this.source) {
      json.source = this.source;
    }

    if (this.meta) {
      json.meta = this.meta;
    }

    return json;
  }

  public toDataJson(addTo: object): NormalData {
    if (!this.source?.pointer || !this.detail) {
      return addTo;
    }

    return this.pointerToObject(addTo, this.source.pointer, this.detail);
  }

  protected pointerToObject(
    addTo: object,
    key: string,
    value: string
  ): Record<string, any> {
    let object: any = addTo;
    const result = object;
    const arr = key.substring(1).split("/");
    for (let i = 0; i < arr.length - 1; i++) {
      object = object[arr[i]] = object[arr[i]] ? object[arr[i]] : {};
    }
    object[arr[arr.length - 1]] = value;
    return result;
  }
}

export default JsonApiError;
