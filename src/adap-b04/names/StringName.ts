import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";
import { InvalidStateException } from "../common/InvalidStateException";

export class StringName extends AbstractName {
  protected name: string = "";
  protected noComponents: number = 0;

  constructor(source: string, delimiter?: string) {
    super();
    // preconditions
    if (source == null || source.length === 0) {
      throw new IllegalArgumentException("Source string must not be empty");
    }

    const d = delimiter ?? DEFAULT_DELIMITER;
    if (!d || d.length !== 1) {
      throw new IllegalArgumentException(
        "Delimiter must be exactly one character"
      );
    }
    if (d === ESCAPE_CHARACTER) {
      throw new IllegalArgumentException(
        "Delimiter cannot be the escape character"
      );
    }

    this.delimiter = d;
    this.name = source;

    const comps = this.parseComponents();
    if (comps.length === 0) {
      throw new InvalidStateException(
        "Name must contain at least one component"
      );
    }
    this.noComponents = comps.length;
  }

  public clone(): Name {
    try {
      return new StringName(this.name, this.delimiter);
    } catch {
      throw new MethodFailedException("Clone failed");
    }
  }

  public asString(delimiter: string = this.delimiter): string {
    if (!delimiter || delimiter.length !== 1) {
      throw new IllegalArgumentException(
        "Delimiter must be exactly one character"
      );
    }
    if (delimiter === ESCAPE_CHARACTER) {
      throw new IllegalArgumentException(
        "Delimiter cannot be the escape character"
      );
    }

    const comps = this.parseComponents();
    return this.buildFromComponents(comps, delimiter);
  }

  public asDataString(): string {
    return this.asString(this.delimiter);
  }

  public isEqual(other: Name): boolean {
    if (!other) return false;

    if (this.getNoComponents() !== other.getNoComponents()) {
      return false;
    }

    for (let i = 0; i < this.getNoComponents(); i++) {
      if (this.getComponent(i) !== other.getComponent(i)) {
        return false;
      }
    }

    return true;
  }

  public getHashCode(): number {
    const comps = this.parseComponents();
    let hash = 0;
    for (const comp of comps) {
      for (let i = 0; i < comp.length; i++) {
        hash = (hash * 31 + comp.charCodeAt(i)) | 0;
      }
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
      throw new IllegalArgumentException("Component index out of bounds");
    }
    const comps = this.parseComponents();
    return comps[i];
  }

  public setComponent(i: number, c: string) {
    if (i < 0 || i >= this.noComponents) {
      throw new IllegalArgumentException("Component index out of bounds");
    }
    if (c == null) {
      throw new IllegalArgumentException("Component must not be null");
    }

    const comps = this.parseComponents();
    comps[i] = c;
    this.rebuildFromComponents(comps);
  }

  public insert(i: number, c: string) {
    const comps = this.parseComponents();
    if (i < 0 || i > comps.length) {
      throw new IllegalArgumentException("Insert index out of bounds");
    }
    if (c == null) {
      throw new IllegalArgumentException("Component must not be null");
    }

    comps.splice(i, 0, c);
    this.rebuildFromComponents(comps);
  }

  public append(c: string) {
    if (c == null) {
      throw new IllegalArgumentException("Component must not be null");
    }

    const comps = this.parseComponents();
    comps.push(c);
    this.rebuildFromComponents(comps);
  }

  public remove(i: number) {
    const comps = this.parseComponents();
    if (i < 0 || i >= comps.length) {
      throw new IllegalArgumentException("Remove index out of bounds");
    }

    comps.splice(i, 1);

    if (comps.length === 0) {
      throw new InvalidStateException("Removing component left name empty");
    }

    this.rebuildFromComponents(comps);
  }

  public concat(other: Name): void {
    if (!other) {
      throw new IllegalArgumentException("Other name must not be null");
    }

    const comps = this.parseComponents();
    const originalCount = comps.length;

    for (let i = 0; i < other.getNoComponents(); i++) {
      comps.push(other.getComponent(i));
    }

    this.rebuildFromComponents(comps);

    if (this.noComponents !== originalCount + other.getNoComponents()) {
      throw new MethodFailedException(
        "Concatenation did not append all components"
      );
    }
  }

  // ======================
  // private helpers
  // ======================

  private parseComponents(): string[] {
    const result: string[] = [];
    let current = "";
    let escaped = false;

    for (let i = 0; i < this.name.length; i++) {
      const ch = this.name[i];

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

    if (escaped) {
      throw new IllegalArgumentException(
        "Dangling escape character at end of name"
      );
    }

    result.push(current);
    return result;
  }

  private buildFromComponents(
    comps: string[],
    delimiter: string = this.delimiter
  ): string {
    let out = "";
    for (let i = 0; i < comps.length; i++) {
      const comp = comps[i];
      for (const ch of comp) {
        if (ch === ESCAPE_CHARACTER || ch === delimiter) {
          out += ESCAPE_CHARACTER;
        }
        out += ch;
      }
      if (i < comps.length - 1) {
        out += delimiter;
      }
    }
    return out;
  }

  private rebuildFromComponents(comps: string[]): void {
    if (comps.length === 0) {
      throw new InvalidStateException(
        "Name must contain at least one component"
      );
    }
    this.name = this.buildFromComponents(comps, this.delimiter);
    this.noComponents = comps.length;
  }
}
