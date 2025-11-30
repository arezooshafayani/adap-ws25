import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";
import { MethodFailedException } from "../common/MethodFailedException";

export abstract class AbstractName implements Name {
  protected delimiter: string = DEFAULT_DELIMITER;

  constructor(delimiter: string = DEFAULT_DELIMITER) {
    // --- PRECONDITION ---
    if (!delimiter || delimiter.length !== 1) {
      throw new IllegalArgumentException(
        "Delimiter must be exactly one character"
      );
    }
    if (delimiter === ESCAPE_CHARACTER) {
      throw new IllegalArgumentException(
        "Delimiter cannot be escape character"
      );
    }

    this.delimiter = delimiter;

    // --- CLASS INVARIANT ---
    this.assertClassInvariant();
  }

  public clone(): Name {
    const copy = Object.create(Object.getPrototypeOf(this)) as this;

    copy.delimiter = this.delimiter;

    // copy each component
    for (let i = 0; i < this.getNoComponents(); i++) {
      copy.append(this.getComponent(i));
    }

    copy.assertClassInvariant();
    return copy;
  }

  public asString(delimiter: string = this.delimiter): string {
    if (!delimiter || delimiter.length !== 1) {
      throw new IllegalArgumentException(
        "Delimiter must be a single character"
      );
    }

    let out = "";
    for (let i = 0; i < this.getNoComponents(); i++) {
      const comp = this.getComponent(i);
      out += this.escapeComponent(comp, delimiter);
      if (i < this.getNoComponents() - 1) {
        out += delimiter;
      }
    }

    return out;
  }

  public toString(): string {
    return this.asDataString();
  }

  public asDataString(): string {
    return this.asString(this.delimiter);
  }

  public isEqual(other: Name): boolean {
    if (this.getNoComponents() !== other.getNoComponents()) return false;

    for (let i = 0; i < this.getNoComponents(); i++) {
      if (this.getComponent(i) !== other.getComponent(i)) {
        return false;
      }
    }

    return true;
  }

  public getHashCode(): number {
    let hash = 0;
    for (let i = 0; i < this.getNoComponents(); i++) {
      const comp = this.getComponent(i);
      for (let j = 0; j < comp.length; j++) {
        hash = (hash * 31 + comp.charCodeAt(j)) >>> 0;
      }
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
    // Precondition: other must not be null
    if (!other) {
      throw new IllegalArgumentException("Other name cannot be null");
    }

    const startCount = this.getNoComponents();

    for (let i = 0; i < other.getNoComponents(); i++) {
      this.append(other.getComponent(i));
    }

    // Postcondition: must increase component count correctly
    if (this.getNoComponents() !== startCount + other.getNoComponents()) {
      throw new MethodFailedException("Concat failed to append all components");
    }

    this.assertClassInvariant();
  }

  // ===========================
  // Helper: escape component
  // ===========================
  protected escapeComponent(comp: string, delimiter: string): string {
    let out = "";
    for (const c of comp) {
      if (c === ESCAPE_CHARACTER || c === delimiter) {
        out += ESCAPE_CHARACTER;
      }
      out += c;
    }
    return out;
  }

  // ===========================
  // CLASS INVARIANT CHECK
  // ===========================
  protected assertClassInvariant(): void {
    // delimiter must be single char
    if (!this.delimiter || this.delimiter.length !== 1) {
      throw new InvalidStateException("Invalid delimiter");
    }
    if (this.delimiter === ESCAPE_CHARACTER) {
      throw new InvalidStateException("Delimiter cannot equal escape char");
    }

    // components must be valid
    for (let i = 0; i < this.getNoComponents(); i++) {
      const comp = this.getComponent(i);
      if (comp == null) throw new InvalidStateException("Null component");

      for (let j = 0; j < comp.length; j++) {
        const ch = comp[j];

        // unescaped escape char
        if (ch === ESCAPE_CHARACTER) {
          if (j === comp.length - 1 || comp[j + 1] !== ESCAPE_CHARACTER) {
            throw new InvalidStateException("Unescaped escape char");
          }
        }

        // unescaped delimiter
        if (ch === this.delimiter) {
          if (j === 0 || comp[j - 1] !== ESCAPE_CHARACTER) {
            throw new InvalidStateException("Unescaped delimiter");
          }
        }
      }
    }
  }
}
