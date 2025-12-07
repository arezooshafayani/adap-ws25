import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";
import { MethodFailedException } from "../common/MethodFailedException";

export abstract class AbstractName implements Name {
  protected delimiter: string = DEFAULT_DELIMITER;

  constructor(delimiter: string = DEFAULT_DELIMITER) {
    IllegalArgumentException.assert(
      delimiter !== null && delimiter !== undefined && delimiter.length === 1,
      "Delimiter must be a single character"
    );
    IllegalArgumentException.assert(
      delimiter !== ESCAPE_CHARACTER,
      "Escape character cannot be used as delimiter"
    );
    this.delimiter = delimiter;
  }

  public clone(): Name {
    const proto = Object.getPrototypeOf(this);
    const copy = Object.create(proto) as Name;
    MethodFailedException.assert(copy !== null, "Clone failed");
    return copy;
  }

  public asString(delimiter: string = this.delimiter): string {
    IllegalArgumentException.assert(
      delimiter !== null && delimiter !== undefined && delimiter.length === 1,
      "Delimiter must be a single character"
    );
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
    const parts: string[] = [];
    for (let i = 0; i < this.getNoComponents(); i++) {
      const c = this.getComponent(i);
      InvalidStateException.assert(
        c !== null && c !== undefined,
        "Component is invalid"
      );
      const escaped = c
        .replace(
          new RegExp(`\\${ESCAPE_CHARACTER}`, "g"),
          ESCAPE_CHARACTER + ESCAPE_CHARACTER
        )
        .replace(
          new RegExp(`\\${this.delimiter}`, "g"),
          ESCAPE_CHARACTER + this.delimiter
        );
      parts.push(escaped);
    }
    return parts.join(this.delimiter);
  }

  public isEqual(other: Name): boolean {
    if (other === null || other === undefined) return false;
    if (this.getNoComponents() !== other.getNoComponents()) return false;
    for (let i = 0; i < this.getNoComponents(); i++) {
      if (this.getComponent(i) !== other.getComponent(i)) return false;
    }
    return true;
  }

  public getHashCode(): number {
    const str = this.asDataString();
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) + hash) ^ str.charCodeAt(i);
    }
    return hash >>> 0;
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
}
