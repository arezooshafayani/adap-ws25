import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringName extends AbstractName {
  protected name: string = "";
  protected noComponents: number = 0;

  constructor(source: string, delimiter?: string) {
    super(delimiter ?? DEFAULT_DELIMITER);

    this.delimiter = delimiter ?? DEFAULT_DELIMITER;
    this.name = source;

    if (source.length === 0) {
      this.noComponents = 0;
      return;
    }

    this.noComponents = source.split(this.delimiter).length;
  }

  public clone(): Name {
    return new StringName(this.name, this.delimiter);
  }

  public asString(delimiter: string = this.delimiter): string {
    return this.name;
  }

  public asDataString(): string {
    return this.name;
  }

  public isEqual(other: Name): boolean {
    if (this.getNoComponents() !== other.getNoComponents()) return false;

    for (let i = 0; i < this.noComponents; i++) {
      if (this.getComponent(i) !== other.getComponent(i)) return false;
    }
    return true;
  }

  public getHashCode(): number {
    let hash = 0;
    for (let i = 0; i < this.name.length; i++) {
      hash = (hash * 31 + this.name.charCodeAt(i)) | 0;
    }
    return hash;
  }

  public isEmpty(): boolean {
    return this.noComponents === 0;
  }

  public getDelimiterCharacter(): string {
    return this.delimiter;
  }

  public getNoComponents(): number {
    return this.noComponents;
  }

  public getComponent(i: number): string {
    if (i < 0 || i >= this.noComponents) {
      throw new RangeError("index out of bounds");
    }
    return this.name.split(this.delimiter)[i];
  }

  public setComponent(i: number, c: string) {
    const comps = this.name.split(this.delimiter);
    if (i < 0 || i >= comps.length) {
      throw new RangeError("index out of bounds");
    }
    comps[i] = c;
    this.name = comps.join(this.delimiter);
  }

  public insert(i: number, c: string) {
    const comps = this.name.length > 0 ? this.name.split(this.delimiter) : [];
    if (i < 0 || i > comps.length) {
      throw new RangeError("index out of bounds");
    }
    comps.splice(i, 0, c);
    this.name = comps.join(this.delimiter);
    this.noComponents = comps.length;
  }

  public append(c: string) {
    this.insert(this.noComponents, c);
  }

  public remove(i: number) {
    const comps = this.name.split(this.delimiter);
    if (i < 0 || i >= comps.length) {
      throw new RangeError("index out of bounds");
    }
    comps.splice(i, 1);
    this.name = comps.join(this.delimiter);
    this.noComponents = comps.length;
  }

  public concat(other: Name): void {
    for (let i = 0; i < other.getNoComponents(); i++) {
      this.append(other.getComponent(i));
    }
  }
}
