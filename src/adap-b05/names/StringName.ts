import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";

export class StringName extends AbstractName {
  protected components: string[] = [];
  protected name: string = "";
  protected noComponents: number = 0;

  constructor(source: string, delimiter?: string) {
    super(delimiter);
    IllegalArgumentException.assert(
      source !== null && source !== undefined,
      "Source must not be null"
    );
    this.name = source;
    this.components = this.parseComponents(source);
    this.noComponents = this.components.length;
  }

  // Helper Function
  protected parseComponents(source: string): string[] {
    const result: string[] = [];
    let current = "";
    let escaped = false;

    for (let i = 0; i < source.length; i++) {
      const ch = source[i];

      if (escaped) {
        current += ch;
        escaped = false;
      } else if (ch === ESCAPE_CHARACTER) {
        escaped = true;
      } else if (ch === this.delimiter) {
        result.push(current);
        current = "";
      } else {
        current += ch;
      }
    }
    result.push(current);
    return result;
  }

  public clone(): Name {
    const copy = new StringName("", this.delimiter);
    copy.components = [...this.components];
    copy.noComponents = this.noComponents;
    return copy;
  }

  public asString(delimiter: string = this.delimiter): string {
    return this.components.join(delimiter);
  }

  public asDataString(): string {
    return this.name;
  }

  public isEqual(other: Name): boolean {
    if (other === this) return true;
    if (other == null) return false;
    if (this.getNoComponents() !== other.getNoComponents()) return false;
    for (let i = 0; i < this.noComponents; i++) {
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
    return this.noComponents === 0;
  }

  public getDelimiterCharacter(): string {
    return this.delimiter;
  }

  public getNoComponents(): number {
    return this.noComponents;
  }

  public getComponent(i: number): string {
    IllegalArgumentException.assert(
      i >= 0 && i < this.noComponents,
      "Index out of bounds"
    );
    return this.components[i];
  }

  public setComponent(i: number, c: string) {
    IllegalArgumentException.assert(
      i >= 0 && i < this.noComponents,
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
      i >= 0 && i <= this.noComponents,
      "Index out of bounds"
    );
    this.components.splice(i, 0, c);
    this.noComponents++;
  }

  public append(c: string) {
    this.components.push(c);
    this.noComponents++;
  }

  public remove(i: number) {
    IllegalArgumentException.assert(
      i >= 0 && i < this.noComponents,
      "Index out of bounds"
    );
    this.components.splice(i, 1);
    this.noComponents--;
  }

  public concat(other: Name): void {
    for (let i = 0; i < other.getNoComponents(); i++) {
      this.components.push(other.getComponent(i));
    }
    this.noComponents = this.components.length;
  }
}
