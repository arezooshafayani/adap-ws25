import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringArrayName extends AbstractName {
  protected components: string[] = [];

  constructor(source: string[], delimiter?: string) {
    // use provided delimiter or fall back to the default
    super(delimiter ?? DEFAULT_DELIMITER);
    // defensive copy of the source array
    this.components = [...source];
  }

  /**
   * Create a deep copy of this name.
   * The array of components is cloned so that changes do not affect the original.
   */
  public clone(): Name {
    const copy = new StringArrayName([...this.components], this.delimiter);
    return copy;
  }

  // --- high-level operations delegate to AbstractName ---
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

  // --- primitive operations specific to the array representation ---

  public getNoComponents(): number {
    return this.components.length;
  }

  public getComponent(i: number): string {
    this.ensureIndexInRange(i, false);
    return this.components[i];
  }

  public setComponent(i: number, c: string) {
    this.ensureIndexInRange(i, false);
    this.components[i] = c;
  }

  public insert(i: number, c: string) {
    // allow inserting at the end as well (i === length)
    if (i < 0 || i > this.components.length) {
      throw new RangeError(`index out of range: ${i}`);
    }
    this.components.splice(i, 0, c);
  }

  public append(c: string) {
    this.components.push(c);
  }

  public remove(i: number) {
    if (i < 0 || i >= this.components.length) {
      throw new RangeError(`index out of range: ${i}`);
    }
    this.components.splice(i, 1);
  }

  public concat(other: Name): void {
    // reuse the generic implementation from AbstractName
    super.concat(other);
  }

  /**
   * Helper to validate an index.
   * If allowEnd is true, i == length is accepted (for insert).
   */
  private ensureIndexInRange(i: number, allowEnd: boolean): void {
    const upper = allowEnd
      ? this.components.length
      : this.components.length - 1;
    if (i < 0 || i > upper) {
      throw new RangeError(`index out of range: ${i}`);
    }
  }
}
