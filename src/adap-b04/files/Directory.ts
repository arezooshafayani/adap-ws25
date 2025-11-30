import { Node } from "./Node";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";

export class Directory extends Node {
  protected childNodes: Set<Node> = new Set<Node>();

  constructor(bn: string, pn: Directory) {
    super(bn, pn);
  }

  public hasChildNode(cn: Node): boolean {
    IllegalArgumentException.assert(
      cn !== null && cn !== undefined,
      "Child node must not be null or undefined."
    );
    return this.childNodes.has(cn);
  }

  public addChildNode(cn: Node): void {
    // precondition: cn is valid
    IllegalArgumentException.assert(
      cn !== null && cn !== undefined,
      "Child node must not be null or undefined."
    );

    // precondition: cn must NOT already exist
    InvalidStateException.assert(
      !this.childNodes.has(cn),
      "Child node already exists in this directory."
    );

    this.childNodes.add(cn);
  }

  public removeChildNode(cn: Node): void {
    // precondition: cn is valid
    IllegalArgumentException.assert(
      cn !== null && cn !== undefined,
      "Child node must not be null or undefined."
    );

    // precondition: cn must exist before removing
    InvalidStateException.assert(
      this.childNodes.has(cn),
      "Cannot remove: child node does not exist."
    );

    this.childNodes.delete(cn); // Yikes! Should have been called remove
  }
}
