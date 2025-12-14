import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";
import { ESCAPE_CHARACTER } from "../common/Printable";

export class StringName extends AbstractName {
  /** Immutable list of components */
  protected readonly components: string[];

  constructor(source: string, delimiter?: string) {
    super(delimiter);

    IllegalArgumentException.assert(
      source !== null && source !== undefined,
      "Source string must not be null or undefined"
    );

    this.components = this.parseComponents(source);
  }

  /**
   * Parses the source string into components exactly once.
   * This logic is identical to the B05 solution, but immutable.
   */
  private parseComponents(source: string): string[] {
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

  public getNoComponents(): number {
    return this.components.length;
  }

  public getComponent(i: number): string {
    this.validateIndex(i);
    return this.components[i];
  }

  public setComponent(i: number, c: string): Name {
    this.validateIndex(i);
    InvalidStateException.assert(
      c !== null && c !== undefined,
      "Component cannot be null or undefined"
    );

    const copy = [...this.components];
    copy[i] = c;
    return new StringName(this.escapeAndJoin(copy), this.delimiter);
  }

  public insert(i: number, c: string): Name {
    IllegalArgumentException.assert(
      i >= 0 && i <= this.components.length,
      `Index out of range: ${i}`
    );
    InvalidStateException.assert(
      c !== null && c !== undefined,
      "Component cannot be null or undefined"
    );

    const copy = [...this.components];
    copy.splice(i, 0, c);
    return new StringName(this.escapeAndJoin(copy), this.delimiter);
  }

  public append(c: string): Name {
    InvalidStateException.assert(
      c !== null && c !== undefined,
      "Component cannot be null or undefined"
    );

    const copy = [...this.components, c];
    return new StringName(this.escapeAndJoin(copy), this.delimiter);
  }

  public remove(i: number): Name {
    this.validateIndex(i);

    const copy = [...this.components];
    copy.splice(i, 1);
    return new StringName(this.escapeAndJoin(copy), this.delimiter);
  }

  public concat(other: Name): Name {
    const copy = [...this.components];
    for (let i = 0; i < other.getNoComponents(); i++) {
      copy.push(other.getComponent(i));
    }
    return new StringName(this.escapeAndJoin(copy), this.delimiter);
  }

  /**
   * Escapes components and joins them into a single string
   * according to the Name contract.
   */
  private escapeAndJoin(parts: string[]): string {
    return parts
      .map((c) =>
        c
          .replace(
            new RegExp(`\\${ESCAPE_CHARACTER}`, "g"),
            ESCAPE_CHARACTER + ESCAPE_CHARACTER
          )
          .replace(
            new RegExp(`\\${this.delimiter}`, "g"),
            ESCAPE_CHARACTER + this.delimiter
          )
      )
      .join(this.delimiter);
  }

  private validateIndex(i: number): void {
    IllegalArgumentException.assert(
      i >= 0 && i < this.components.length,
      `Index out of range: ${i}`
    );
  }
}
