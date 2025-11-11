import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export class StringName implements Name {
  protected delimiter: string = DEFAULT_DELIMITER;
  protected name: string = "";
  protected noComponents: number = 0;

  constructor(source: string, delimiter?: string) {
    if (delimiter && delimiter.length > 0) {
      this.delimiter = delimiter;
    }

    this.name = source ?? "";

    this.noComponents =
      this.name.length === 0 ? 0 : this.split(this.name, this.delimiter).length;
  }

  private toArray(): string[] {
    if (this.name.length === 0) return [];
    return this.name.split(this.delimiter);
  }

  private fromArray(a: string[]): void {
    this.name = a.join(this.delimiter);
    this.noComponents = a.length;
  }

  public asString(delimiter: string = this.delimiter): string {
    if (!this.name) return "";
    if (delimiter === this.delimiter) return this.name;
    const parts = this.split(this.name, this.delimiter);
    return parts.join(delimiter);
  }

  public asDataString(): string {
    return this.asString(DEFAULT_DELIMITER);
  }

  public getDelimiterCharacter(): string {
    return this.delimiter;
  }

  public isEmpty(): boolean {
    return this.noComponents === 0;
  }

  public getNoComponents(): number {
    return this.noComponents;
  }

  public getComponent(x: number): string {
    const parts = this.parts();
    return parts[x];
  }

  public setComponent(n: number, c: string): void {
    const parts = this.parts();
    parts[n] = c;
    this.rebuildFrom(parts);
  }

  public insert(n: number, c: string): void {
    const parts = this.parts();
    parts.splice(n, 0, c);
    this.rebuildFrom(parts);
  }

  public append(c: string): void {
    const parts = this.parts();
    parts.push(c);
    this.rebuildFrom(parts);
  }

  public remove(n: number): void {
    const parts = this.parts();
    parts.splice(n, 1);
    this.rebuildFrom(parts);
  }

  public concat(other: Name): void {
    const lhs = this.parts();
    const rhsStr = other.asString(this.delimiter);
    if (rhsStr.length === 0) return;
    const rhs = this.split(rhsStr, this.delimiter);
    this.rebuildFrom(lhs.concat(rhs));
  }

  // --- helpers ---

  protected parts(): string[] {
    if (!this.name) return [];
    return this.split(this.name, this.delimiter);
  }

  protected rebuildFrom(parts: string[]): void {
    this.name = parts.join(this.delimiter);
    this.noComponents = parts.length;
  }

  protected split(s: string, delim: string): string[] {
    // keep empty components (e.g., "///" -> ["", "", "", ""])
    return s === "" ? [] : s.split(delim);
  }
}
