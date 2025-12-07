import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export abstract class AbstractName implements Name {
  protected delimiter: string = DEFAULT_DELIMITER;

  constructor(delimiter: string = DEFAULT_DELIMITER) {
    this.delimiter = delimiter;
  }

  public clone(): Name {
    const proto = Object.getPrototypeOf(this);
    const copy = Object.create(proto);
    Object.assign(copy, this);
    return copy as Name;
  }

  public asString(delimiter: string = this.delimiter): string {
    const parts: string[] = [];
    for (let i = 0; i < this.getNoComponents(); i++) {
      parts.push(this.getComponent(i));
    }
    return parts.join(delimiter);
  }

  public toString(): string {
    return this.asDataString();
  }

  public asDataString(): string {
    const encoded: string[] = [];
    for (let i = 0; i < this.getNoComponents(); i++) {
      const comp = this.getComponent(i);
      encoded.push(AbstractName.encodeComponent(comp));
    }
    return encoded.join(DEFAULT_DELIMITER);
  }

  public isEqual(other: Name): boolean {
    if (other === this) {
      return true;
    }
    if (!other) {
      return false;
    }
    return this.asDataString() === other.asDataString();
  }

  public getHashCode(): number {
    const s = this.asDataString();
    let hash = 0;
    for (let i = 0; i < s.length; i++) {
      hash = (hash * 31 + s.charCodeAt(i)) | 0;
    }
    return hash;
  }

  public isEmpty(): boolean {
    return this.getNoComponents() === 0;
  }

  public getDelimiterCharacter(): string {
    return this.delimiter;
  }

  abstract getNoComponents(): number;

  abstract getComponent(i: number): string;
  abstract setComponent(i: number, c: string): void;

  abstract insert(i: number, c: string): void;
  abstract append(c: string): void;
  abstract remove(i: number): void;

  public concat(other: Name): void {
    for (let i = 0; i < other.getNoComponents(); i++) {
      this.append(other.getComponent(i));
    }
  }

  /**
   * Escape occurrences of the default delimiter and escape character
   * inside a single name component.
   */
  private static encodeComponent(component: string): string {
    let result = "";
    for (const ch of component) {
      if (ch === DEFAULT_DELIMITER || ch === ESCAPE_CHARACTER) {
        result += ESCAPE_CHARACTER;
      }
      result += ch;
    }
    return result;
  }
}
