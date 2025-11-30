import { Node } from "./Node";
import { Directory } from "./Directory";
import { MethodFailedException } from "../common/MethodFailedException";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";

enum FileState {
  OPEN,
  CLOSED,
  DELETED,
}

export class File extends Node {
  protected state: FileState = FileState.CLOSED;

  constructor(baseName: string, parent: Directory) {
    super(baseName, parent);
  }

  public open(): void {
    // precondition: must be CLOSED to open
    InvalidStateException.assert(
      this.state === FileState.CLOSED,
      "File must be CLOSED before opening."
    );

    this.state = FileState.OPEN;
  }

  public read(noBytes: number): Int8Array {
    // precondition #1: noBytes > 0
    IllegalArgumentException.assert(
      Number.isInteger(noBytes) && noBytes > 0,
      "Number of bytes must be a positive integer."
    );

    // precondition #2: file must be OPEN
    InvalidStateException.assert(
      this.state === FileState.OPEN,
      "File must be OPEN to read."
    );

    return new Int8Array(noBytes);
  }

  public close(): void {
    // precondition: must be OPEN to close
    InvalidStateException.assert(
      this.state === FileState.OPEN,
      "File must be OPEN before closing."
    );

    this.state = FileState.CLOSED;
  }

  protected doGetFileState(): FileState {
    return this.state;
  }
}
