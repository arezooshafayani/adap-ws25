import { describe, it, expect } from "vitest";

import { StringName } from "../../../src/adap-b04/names/StringName";
import { StringArrayName } from "../../../src/adap-b04/names/StringArrayName";

import { IllegalArgumentException } from "../../../src/adap-b04/common/IllegalArgumentException";
import { InvalidStateException } from "../../../src/adap-b04/common/InvalidStateException";
import { ESCAPE_CHARACTER } from "../../../src/adap-b04/common/Printable";

describe("StringName – contract tests", () => {
  it("constructor parses simple dotted name", () => {
    const n = new StringName("oss.cs.fau.de", ".");

    expect(n.isEmpty()).toBe(false);
    expect(n.getNoComponents()).toBe(4);
    expect(n.getComponent(0)).toBe("oss");
    expect(n.getComponent(1)).toBe("cs");
    expect(n.getComponent(2)).toBe("fau");
    expect(n.getComponent(3)).toBe("de");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });

  it("handles escape character in input string", () => {
    const n = new StringName("Oh\\.\\.", ".");

    expect(n.getNoComponents()).toBe(1);
    expect(n.getComponent(0)).toBe("Oh..");
    expect(n.asString()).toBe("Oh\\.\\.");
  });

  it("precondition: constructor rejects empty string", () => {
    expect(() => new StringName("", ".")).toThrow(IllegalArgumentException);
  });

  it("precondition: constructor rejects invalid delimiter", () => {
    expect(() => new StringName("a.b", "")).toThrow(IllegalArgumentException);
    expect(() => new StringName("a.b", "..")).toThrow(IllegalArgumentException);
    expect(() => new StringName("a.b", ESCAPE_CHARACTER)).toThrow(
      IllegalArgumentException
    );
  });

  it("precondition: getComponent index out of bounds", () => {
    const n = new StringName("a.b", ".");
    expect(() => n.getComponent(-1)).toThrow(IllegalArgumentException);
    expect(() => n.getComponent(2)).toThrow(IllegalArgumentException);
  });

  it("postcondition: append adds component at the end", () => {
    const n = new StringName("a.b", ".");
    n.append("c");

    expect(n.getNoComponents()).toBe(3);
    expect(n.getComponent(2)).toBe("c");
    expect(n.asString()).toBe("a.b.c");
  });

  it("postcondition: insert inserts at given index", () => {
    const n = new StringName("a.c", ".");
    n.insert(1, "b");

    expect(n.getNoComponents()).toBe(3);
    expect(n.getComponent(0)).toBe("a");
    expect(n.getComponent(1)).toBe("b");
    expect(n.getComponent(2)).toBe("c");
  });

  it("postcondition: setComponent replaces component", () => {
    const n = new StringName("a.b", ".");
    n.setComponent(1, "x");

    expect(n.getNoComponents()).toBe(2);
    expect(n.getComponent(0)).toBe("a");
    expect(n.getComponent(1)).toBe("x");
  });

  it("class invariant: removing last component is forbidden", () => {
    const n = new StringName("only", ".");
    expect(() => n.remove(0)).toThrow(InvalidStateException);
  });

  it("concat appends components from other name", () => {
    const n1 = new StringName("a.b", ".");
    const n2 = new StringName("c.d", ".");

    n1.concat(n2);

    expect(n1.getNoComponents()).toBe(4);
    expect(n1.asString()).toBe("a.b.c.d");
  });

  it("equality and hashCode consistent with StringArrayName", () => {
    const stringName = new StringName("oss.cs.fau.de", ".");
    const arrayName = new StringArrayName(["oss", "cs", "fau", "de"], ".");

    expect(stringName.isEqual(arrayName)).toBe(true);
    expect(arrayName.isEqual(stringName)).toBe(true);

    expect(stringName.getHashCode()).toBe(arrayName.getHashCode());
  });

  it("clone produces equal but independent copy", () => {
    const original = new StringName("a.b", ".");
    const clone = original.clone();

    expect(clone.isEqual(original)).toBe(true);

    clone.setComponent(1, "x");
    expect(original.getComponent(1)).toBe("b");
    expect(clone.getComponent(1)).toBe("x");
  });
});
