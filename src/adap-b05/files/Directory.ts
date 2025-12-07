import { Node } from "./Node";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";
import { MethodFailedException } from "../common/MethodFailedException";

export class Directory extends Node {
  protected childNodes: Set<Node> = new Set<Node>();

  constructor(bn: string, pn: Directory) {
    super(bn, pn);
    this.assertClassInvariant();
  }

  public hasChildNode(cn: Node): boolean {
    IllegalArgumentException.assert(
      cn !== null && cn !== undefined,
      "Child node must not be null"
    );
    return this.childNodes.has(cn);
  }

  public addChildNode(cn: Node): void {
    IllegalArgumentException.assert(
      cn !== null && cn !== undefined,
      "Child node must not be null"
    );
    InvalidStateException.assert(cn !== this, "Directory cannot add itself");
    const before = this.childNodes.size;
    this.childNodes.add(cn);
    MethodFailedException.assert(
      this.childNodes.size === before + 1 || this.childNodes.has(cn),
      "Failed to add child node"
    );
    this.assertClassInvariant();
  }

  public removeChildNode(cn: Node): void {
    IllegalArgumentException.assert(
      cn !== null && cn !== undefined,
      "Child node must not be null"
    );
    InvalidStateException.assert(
      this.childNodes.has(cn),
      "Child node not found"
    );
    const before = this.childNodes.size;
    this.childNodes.delete(cn);
    MethodFailedException.assert(
      this.childNodes.size === before - 1,
      "Failed to remove child node"
    );
    this.assertClassInvariant();
  }

  //Helper Function
  protected assertClassInvariant(): void {
    for (const child of this.childNodes) {
      InvalidStateException.assert(
        child !== null && child !== undefined,
        "Directory contains invalid child"
      );
      InvalidStateException.assert(
        child.getParentNode() === this,
        "Child node has incorrect parent"
      );
      InvalidStateException.assert(
        child !== this,
        "Directory cannot contain itself"
      );
    }
  }
}
