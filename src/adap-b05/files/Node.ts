import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";
import { ServiceFailureException } from "../common/ServiceFailureException";
import { Exception } from "../common/Exception";

import { Name } from "../names/Name";
import type { Directory } from "./Directory";

export class Node {
  protected baseName: string = "";
  protected parentNode: Directory;

  constructor(bn: string, pn: Directory) {
    this.doSetBaseName(bn);
    this.parentNode = pn;
    this.initialize(pn);
  }

  protected initialize(pn: Directory): void {
    this.parentNode = pn;
    this.parentNode.addChildNode(this);
  }

  public move(to: Directory): void {
    this.parentNode.removeChildNode(this);
    to.addChildNode(this);
    this.parentNode = to;
  }

  public getFullName(): Name {
    const result: Name = this.parentNode.getFullName();
    result.append(this.getBaseName());
    return result;
  }

  public getBaseName(): string {
    return this.doGetBaseName();
  }

  protected doGetBaseName(): string {
    return this.baseName;
  }

  public rename(bn: string): void {
    this.doSetBaseName(bn);
  }

  protected doSetBaseName(bn: string): void {
    this.baseName = bn;
  }

  public getParentNode(): Directory {
    return this.parentNode;
  }

  /**
   * Returns all nodes in the tree that match bn
   * @param bn basename of node being searched for
   */
  public findNodes(bn: string): Set<Node> {
    IllegalArgumentException.assert(
      bn !== null && bn !== undefined,
      "Name to search cannot be null"
    );

    const result: Set<Node> = new Set();

    try {
      if (this.getBaseName() === bn) {
        result.add(this);
      }

      // Detect Directory without importing Directory class
      if ((this as any).childNodes instanceof Set) {
        const children: Set<Node> = (this as any).childNodes;
        for (const child of children) {
          const childResults = child.findNodes(bn);
          childResults.forEach((n) => result.add(n));
        }
      }

      return result;
    } catch (inner) {
      if (inner instanceof ServiceFailureException) {
        throw inner;
      }

      if (inner instanceof InvalidStateException) {
        throw new ServiceFailureException(
          "Service failure during findNodes",
          inner
        );
      }

      throw new ServiceFailureException("Service failure during findNodes");
    }
  }

  /**
   * Helper to escalate a failure at the service boundary.
   */
  private raiseServiceFailure(inner: Exception): never {
    const sfe = new ServiceFailureException(
      "Service failure during findNodes",
      inner
    );
    throw sfe;
  }
}
