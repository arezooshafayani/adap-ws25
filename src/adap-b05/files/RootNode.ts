import { Name } from "../names/Name";
import { StringName } from "../names/StringName";
import { Directory } from "./Directory";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";

export class RootNode extends Directory {
  protected static ROOT_NODE: RootNode = new RootNode();

  public static getRootNode() {
    return this.ROOT_NODE;
  }

  constructor() {
    super("", null as any);
    this.parentNode = this;
  }

  protected initialize(pn: Directory): void {
    this.parentNode = this;
  }

  public getFullName(): Name {
    return new StringName("", "/");
  }

  public move(to: Directory): void {
    // null operation
  }

  protected doSetBaseName(bn: string): void {
    // Root node name is always empty and cannot change
  }

  protected assertClassInvariant(): void {
    InvalidStateException.assert(
      this.parentNode === this,
      "RootNode must be its own parent"
    );
  }
}
