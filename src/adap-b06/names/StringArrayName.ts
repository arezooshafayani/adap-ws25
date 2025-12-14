import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";

export class StringArrayName extends AbstractName {
  protected readonly components: string[];

  constructor(source: string[], delimiter?: string) {
    super(delimiter);
    IllegalArgumentException.assert(
      source !== null && source !== undefined,
      "Source array must be defined and non-null"
    );
    this.components = [...source];
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
      "Component cannot be null"
    );
    const copy = [...this.components];
    copy[i] = c;
    return new StringArrayName(copy, this.delimiter);
  }

  public insert(i: number, c: string): Name {
    IllegalArgumentException.assert(
      i >= 0 && i <= this.components.length,
      `index out of range: ${i}`
    );
    InvalidStateException.assert(
      c !== null && c !== undefined,
      "Component cannot be null"
    );
    const copy = [...this.components];
    copy.splice(i, 0, c);
    return new StringArrayName(copy, this.delimiter);
  }

  public append(c: string): Name {
    InvalidStateException.assert(
      c !== null && c !== undefined,
      "Component cannot be null"
    );
    const copy = [...this.components];
    copy.push(c);
    return new StringArrayName(copy, this.delimiter);
  }

  public remove(i: number): Name {
    this.validateIndex(i);
    const copy = [...this.components];
    copy.splice(i, 1);
    return new StringArrayName(copy, this.delimiter);
  }

  public concat(other: Name): Name {
    const copy = [...this.components];
    for (let i = 0; i < other.getNoComponents(); i++) {
      copy.push(other.getComponent(i));
    }
    return new StringArrayName(copy, this.delimiter);
  }

  private validateIndex(i: number): void {
    IllegalArgumentException.assert(
      i >= 0 && i < this.components.length,
      `index out of range: ${i}`
    );
  }
}
