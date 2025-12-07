import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";

export class StringArrayName extends AbstractName {
  protected components: string[] = [];

  constructor(source: string[], delimiter?: string) {
    super(delimiter);
    IllegalArgumentException.assert(
      Array.isArray(source),
      "Source must be an array"
    );
    this.components = [...source];
  }

  public clone(): Name {
    const copy = new StringArrayName([], this.delimiter);
    copy.components = [...this.components];
    return copy;
  }

  public asString(delimiter: string = this.delimiter): string {
    IllegalArgumentException.assert(
      delimiter.length === 1,
      "Delimiter must be one character"
    );
    return this.components.join(delimiter);
  }

  public asDataString(): string {
    const escaped = this.components.map((c) =>
      c
        .replace(
          new RegExp(`\\${ESCAPE_CHARACTER}`, "g"),
          ESCAPE_CHARACTER + ESCAPE_CHARACTER
        )
        .replace(
          new RegExp(`\\${this.delimiter}`, "g"),
          ESCAPE_CHARACTER + this.delimiter
        )
    );
    return escaped.join(this.delimiter);
  }

  public isEqual(other: Name): boolean {
    if (other === this) return true;
    if (other == null) return false;
    if (this.getNoComponents() !== other.getNoComponents()) return false;
    for (let i = 0; i < this.components.length; i++) {
      if (this.components[i] !== other.getComponent(i)) return false;
    }
    return true;
  }

  public getHashCode(): number {
    const s = this.asDataString();
    let hash = 5381;
    for (let i = 0; i < s.length; i++) {
      hash = ((hash << 5) + hash) ^ s.charCodeAt(i);
    }
    return hash >>> 0;
  }

  public isEmpty(): boolean {
    return this.components.length === 0;
  }

  public getDelimiterCharacter(): string {
    return this.delimiter;
  }

  public getNoComponents(): number {
    return this.components.length;
  }

  public getComponent(i: number): string {
    IllegalArgumentException.assert(
      i >= 0 && i < this.components.length,
      "Index out of bounds"
    );
    return this.components[i];
  }

  public setComponent(i: number, c: string) {
    IllegalArgumentException.assert(
      i >= 0 && i < this.components.length,
      "Index out of bounds"
    );
    InvalidStateException.assert(
      c !== null && c !== undefined,
      "Component cannot be null"
    );
    this.components[i] = c;
  }

  public insert(i: number, c: string) {
    IllegalArgumentException.assert(
      i >= 0 && i <= this.components.length,
      "Index out of bounds"
    );
    this.components.splice(i, 0, c);
  }

  public append(c: string) {
    this.components.push(c);
  }

  public remove(i: number) {
    IllegalArgumentException.assert(
      i >= 0 && i < this.components.length,
      "Index out of bounds"
    );
    this.components.splice(i, 1);
  }

  public concat(other: Name): void {
    for (let i = 0; i < other.getNoComponents(); i++) {
      this.components.push(other.getComponent(i));
    }
  }
}
