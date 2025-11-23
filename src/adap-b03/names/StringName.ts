import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringName extends AbstractName {
  protected name: string = "";
  protected noComponents: number = 0;

  constructor(source: string, delimiter?: string) {
    super(delimiter ?? DEFAULT_DELIMITER);

    // store raw string
    this.name = source;

    // compute number of components
    this.noComponents = this.splitComponents(this.name).length;
  }

  public clone(): Name {
    return new StringName(this.name, this.delimiter);
  }

  // --- delegate to AbstractName ---

  public asString(delimiter: string = this.delimiter): string {
    return super.asString(delimiter);
  }

  public asDataString(): string {
    return super.asDataString();
  }

  public isEqual(other: Name): boolean {
    return super.isEqual(other);
  }

  public getHashCode(): number {
    return super.getHashCode();
  }

  public isEmpty(): boolean {
    return super.isEmpty();
  }

  public getDelimiterCharacter(): string {
    return super.getDelimiterCharacter();
  }

  // --- primitive operations ---

  public getNoComponents(): number {
    return this.noComponents;
  }

  public getComponent(i: number): string {
    const parts = this.splitComponents(this.name);
    if (i < 0 || i >= parts.length) {
      throw new RangeError(`index out of range: ${i}`);
    }
    return parts[i];
  }

  public setComponent(i: number, c: string) {
    const parts = this.splitComponents(this.name);
    if (i < 0 || i >= parts.length) {
      throw new RangeError(`index out of range: ${i}`);
    }
    parts[i] = c;
    this.rebuild(parts);
  }

  public insert(i: number, c: string) {
    const parts = this.splitComponents(this.name);
    if (i < 0 || i > parts.length) {
      throw new RangeError(`index out of range: ${i}`);
    }
    parts.splice(i, 0, c);
    this.rebuild(parts);
  }

  public append(c: string) {
    const parts = this.splitComponents(this.name);
    parts.push(c);
    this.rebuild(parts);
  }

  public remove(i: number) {
    const parts = this.splitComponents(this.name);
    if (i < 0 || i >= parts.length) {
      throw new RangeError(`index out of range: ${i}`);
    }
    parts.splice(i, 1);
    this.rebuild(parts);
  }

  public concat(other: Name): void {
    super.concat(other);
  }

  // --- helper methods ---

  /** splits name into components, un-escaping where needed */
  private splitComponents(text: string): string[] {
    if (text.length === 0) {
      return [];
    }

    const result: string[] = [];
    let current = "";
    let escaped = false;

    for (const ch of text) {
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

  /** rebuilds this.name and resets noComponents */
  private rebuild(parts: string[]) {
    this.name = parts.join(this.delimiter);
    this.noComponents = parts.length;
  }
}
