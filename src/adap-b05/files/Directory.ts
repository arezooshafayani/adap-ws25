import { Node } from "./Node";
import { ServiceFailureException } from "../common/ServiceFailureException";
import { Exception } from "../common/Exception";

export class Directory extends Node {
  protected childNodes: Set<Node> = new Set<Node>();

  constructor(bn: string, pn: Directory) {
    super(bn, pn);
  }

  public hasChildNode(cn: Node): boolean {
    return this.childNodes.has(cn);
  }

  public addChildNode(cn: Node): void {
    this.childNodes.add(cn);
  }

  public removeChildNode(cn: Node): void {
    this.childNodes.delete(cn); // Yikes! Should have been called remove
  }

  public getChildNodes(): Set<Node> {
    return this.childNodes;
  }

  public findNodes(bn: string): Set<Node> {
    try {
      const result = super.findNodes(bn);

      for (const child of this.childNodes) {
        const childMatches = child.findNodes(bn);
        for (const n of childMatches) {
          result.add(n);
        }
      }

      return result;
    } catch (err) {
      throw new ServiceFailureException("findNodes failed", err as Exception);
    }
  }
}
