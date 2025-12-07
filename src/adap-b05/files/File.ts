import { Node } from "./Node";
import { Directory } from "./Directory";

import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";
import { MethodFailedException } from "../common/MethodFailedException";

enum FileState {
  OPEN,
  CLOSED,
  DELETED,
}

export class File extends Node {
  protected state: FileState = FileState.CLOSED;

  constructor(baseName: string, parent: Directory) {
    super(baseName, parent);
    this.assertClassInvariant();
  }

  // ------------------------------------------------------------
  // Contract helpers
  // ------------------------------------------------------------

  protected assertClassInvariant(): void {
    // Valid states are OPEN, CLOSED, DELETED
    const valid =
      this.state === FileState.OPEN ||
      this.state === FileState.CLOSED ||
      this.state === FileState.DELETED;

    InvalidStateException.assert(valid, "Invalid file state");
  }

  public open(): void {
    // Preconditions
    InvalidStateException.assert(
      this.state !== FileState.DELETED,
      "Cannot open a deleted file"
    );
    InvalidStateException.assert(
      this.state !== FileState.OPEN,
      "File is already open"
    );

    // Transition
    this.state = FileState.OPEN;

    // Postcondition
    MethodFailedException.assert(
      this.state === FileState.OPEN,
      "Failed to open file"
    );

    this.assertClassInvariant();
  }

  public read(noBytes: number): Int8Array {
    // Preconditions
    IllegalArgumentException.assert(
      noBytes > 0,
      "Number of bytes to read must be positive"
    );
    InvalidStateException.assert(
      this.state === FileState.OPEN,
      "Cannot read a file that is not open"
    );

    const result = new Int8Array(noBytes);
    let tries = 0;

    for (let i = 0; i < noBytes; i++) {
      try {
        result[i] = this.readNextByte();
      } catch (ex) {
        tries++;

        if (ex instanceof MethodFailedException) {
          // Resumption strategy: return zero byte, continue
          result[i] = 0;
          continue;
        } else {
          // Unknown exception → escalate
          throw ex;
        }
      }
    }

    // Postcondition: After a read, the file must still be in OPEN state
    MethodFailedException.assert(
      this.state === FileState.OPEN,
      "File state corrupted during read"
    );

    this.assertClassInvariant();
    return result;
  }

  protected readNextByte(): number {
    return 0; // @todo
  }

  public close(): void {
    // Preconditions
    InvalidStateException.assert(
      this.state !== FileState.DELETED,
      "Cannot close a deleted file"
    );
    InvalidStateException.assert(
      this.state === FileState.OPEN,
      "Cannot close a file that is not open"
    );

    // Transition
    this.state = FileState.CLOSED;

    // Postcondition
    MethodFailedException.assert(
      this.state === FileState.CLOSED,
      "Failed to close file"
    );

    this.assertClassInvariant();
  }

  protected doGetFileState(): FileState {
    return this.state;
  }
}
