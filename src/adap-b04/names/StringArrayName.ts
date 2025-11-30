import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";
import { InvalidStateException } from "../common/InvalidStateException";

export class StringArrayName extends AbstractName {
  protected components: string[] = [];

  constructor(source: string[], delimiter?: string) {
    super();
    // preconditions
    if (!source || source.length === 0) {
      throw new IllegalArgumentException(
        "Source array must contain at least one component"
      );
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

    // validate and copy components
    for (const c of source) {
      if (c == null) {
        throw new IllegalArgumentException("Components must not be null");
      }
      this.components.push(c);
    }

    // simple invariant: at least 1 component
    if (this.components.length === 0) {
      throw new InvalidStateException("Name must have at least one component");
    }
  }

  public clone(): Name {
    try {
      return new StringArrayName([...this.components], this.delimiter);
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

    let out = "";
    for (let i = 0; i < this.components.length; i++) {
      const comp = this.components[i];
      let escaped = "";

      for (const ch of comp) {
        if (ch === ESCAPE_CHARACTER || ch === delimiter) {
          escaped += ESCAPE_CHARACTER;
        }
        escaped += ch;
      }

      out += escaped;
      if (i < this.components.length - 1) {
        out += delimiter;
      }
    }

    return out;
  }

  public asDataString(): string {
    // use the internal delimiter
    return this.asString(this.delimiter);
  }

  public isEqual(other: Name): boolean {
    if (other == null) return false;
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
    for (const comp of this.components) {
      for (let i = 0; i < comp.length; i++) {
        hash = (hash * 31 + comp.charCodeAt(i)) | 0;
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

  public getNoComponents(): number {
    if (!this.components) {
      return 0;
    }
    return this.components.length;
  }

  public getComponent(i: number): string {
    if (i < 0 || i >= this.components.length) {
      throw new IllegalArgumentException("Component index out of bounds");
    }
    return this.components[i];
  }

  public setComponent(i: number, c: string) {
    if (i < 0 || i >= this.components.length) {
      throw new IllegalArgumentException("Component index out of bounds");
    }
    if (c == null) {
      throw new IllegalArgumentException("Component must not be null");
    }
    this.components[i] = c;
  }

  public insert(i: number, c: string) {
    if (i < 0 || i > this.components.length) {
      throw new IllegalArgumentException("Insert index out of bounds");
    }
    if (c == null) {
      throw new IllegalArgumentException("Component must not be null");
    }
    this.components.splice(i, 0, c);
  }

  public append(c: string) {
    if (c == null) {
      throw new IllegalArgumentException("Component must not be null");
    }
    this.components.push(c);
  }

  public remove(i: number) {
    if (i < 0 || i >= this.components.length) {
      throw new IllegalArgumentException("Remove index out of bounds");
    }
    this.components.splice(i, 1);

    if (this.components.length === 0) {
      throw new InvalidStateException("Removing component left name empty");
    }
  }

  public concat(other: Name): void {
    if (!other) {
      throw new IllegalArgumentException("Other name must not be null");
    }

    const originalCount = this.getNoComponents();

    for (let i = 0; i < other.getNoComponents(); i++) {
      this.append(other.getComponent(i));
    }

    if (this.getNoComponents() !== originalCount + other.getNoComponents()) {
      throw new MethodFailedException(
        "Concatenation did not append all components"
      );
    }
  }
}
