import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export abstract class AbstractName implements Name {
  protected delimiter: string = DEFAULT_DELIMITER;

  constructor(delimiter: string = DEFAULT_DELIMITER) {
    this.delimiter = delimiter;
  }

  /**
   * Generic clone implementation: creates a shallow copy of this instance.
   * Concrete subclasses can override this if they need a deeper clone.
   */
  public clone(): Name {
    const proto = Object.getPrototypeOf(this);
    const copy = Object.create(proto) as this;
    for (const key of Object.keys(this)) {
      (copy as any)[key] = (this as any)[key];
    }
    return copy;
  }

  /**
   * Join components using the given delimiter, without additional escaping.
   */
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

  /**
   * Canonical data representation:
   * each component is escaped, then joined using this.delimiter.
   */
  public asDataString(): string {
    const result: string[] = [];
    for (let i = 0; i < this.getNoComponents(); i++) {
      const raw = this.getComponent(i);
      result.push(this.escapeComponent(raw));
    }
    return result.join(this.delimiter);
  }

  /**
   * Two names are equal if:
   *  - they use the same delimiter,
   *  - they have the same number of components,
   *  - all corresponding components are equal.
   */
  public isEqual(other: Name): boolean {
    if (this === other) {
      return true;
    }

    if (this.getDelimiterCharacter() !== other.getDelimiterCharacter()) {
      return false;
    }

    const len = this.getNoComponents();
    if (len !== other.getNoComponents()) {
      return false;
    }

    for (let i = 0; i < len; i++) {
      if (this.getComponent(i) !== other.getComponent(i)) {
        return false;
      }
    }

    return true;
  }

  /**
   * Simple hash based on the data string.
   * Uses a 31-based rolling hash.
   */
  public getHashCode(): number {
    const text = this.asDataString();
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      const code = text.charCodeAt(i);
      hash = (hash * 31 + code) | 0;
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

  /**
   * Append all components of the other name to this one.
   */
  public concat(other: Name): void {
    const len = other.getNoComponents();
    for (let i = 0; i < len; i++) {
      this.append(other.getComponent(i));
    }
  }

  /**
   * Escape ESCAPE_CHARACTER and the delimiter inside a single component.
   */
  protected escapeComponent(component: string): string {
    let escaped = "";
    for (let i = 0; i < component.length; i++) {
      const ch = component[i];
      if (ch === ESCAPE_CHARACTER || ch === this.delimiter) {
        escaped += ESCAPE_CHARACTER;
      }
      escaped += ch;
    }
    return escaped;
  }
}
