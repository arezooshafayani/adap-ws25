import { describe, it, expect } from "vitest";

import { StringArrayName } from "../../../src/adap-b04/names/StringArrayName";
import { StringName } from "../../../src/adap-b04/names/StringName";

import { IllegalArgumentException } from "../../../src/adap-b04/common/IllegalArgumentException";
import { InvalidStateException } from "../../../src/adap-b04/common/InvalidStateException";
import { ESCAPE_CHARACTER } from "../../../src/adap-b04/common/Printable";

describe("StringArrayName – contract tests", () => {
  it("constructor sets components and delimiter correctly", () => {
    const n = new StringArrayName(["oss", "cs", "fau", "de"], ".");

    expect(n.isEmpty()).toBe(false);
    expect(n.getNoComponents()).toBe(4);
    expect(n.getComponent(0)).toBe("oss");
    expect(n.getComponent(1)).toBe("cs");
    expect(n.getComponent(2)).toBe("fau");
    expect(n.getComponent(3)).toBe("de");

    expect(n.getDelimiterCharacter()).toBe(".");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });

  it("handles escape character in components", () => {
    const n = new StringArrayName(["Oh.."], ".");
    // باید delimiter و ESCAPE را در چاپ escape کند
    expect(n.asString()).toBe(`Oh\\\.\\\.`);
    expect(n.getNoComponents()).toBe(1);
    expect(n.getComponent(0)).toBe("Oh..");
  });

  it("precondition: constructor rejects empty component array", () => {
    expect(() => new StringArrayName([], ".")).toThrow(
      IllegalArgumentException
    );
  });

  it("precondition: constructor rejects invalid delimiter", () => {
    // طول صفر
    expect(() => new StringArrayName(["a"], "")).toThrow(
      IllegalArgumentException
    );
    // طول بیشتر از یک
    expect(() => new StringArrayName(["a"], "..")).toThrow(
      IllegalArgumentException
    );
    // خود ESCAPE
    expect(() => new StringArrayName(["a"], ESCAPE_CHARACTER)).toThrow(
      IllegalArgumentException
    );
  });

  it("precondition: getComponent index out of bounds", () => {
    const n = new StringArrayName(["a", "b"], ".");
    expect(() => n.getComponent(-1)).toThrow(IllegalArgumentException);
    expect(() => n.getComponent(2)).toThrow(IllegalArgumentException);
  });

  it("postcondition: append adds a new component at the end", () => {
    const n = new StringArrayName(["a", "b"], ".");
    n.append("c");

    expect(n.getNoComponents()).toBe(3);
    expect(n.getComponent(2)).toBe("c");
    expect(n.asString()).toBe("a.b.c");
  });

  it("postcondition: insert inserts at given index", () => {
    const n = new StringArrayName(["a", "c"], ".");
    n.insert(1, "b");

    expect(n.getNoComponents()).toBe(3);
    expect(n.getComponent(0)).toBe("a");
    expect(n.getComponent(1)).toBe("b");
    expect(n.getComponent(2)).toBe("c");
  });

  it("postcondition: setComponent replaces component", () => {
    const n = new StringArrayName(["a", "b"], ".");
    n.setComponent(1, "x");

    expect(n.getNoComponents()).toBe(2);
    expect(n.getComponent(0)).toBe("a");
    expect(n.getComponent(1)).toBe("x");
  });

  it("class invariant: removing last component is forbidden", () => {
    const n = new StringArrayName(["only"], ".");
    expect(() => n.remove(0)).toThrow(InvalidStateException);
  });

  it("concat appends components from other name", () => {
    const n1 = new StringArrayName(["a", "b"], ".");
    const n2 = new StringArrayName(["c", "d"], ".");

    n1.concat(n2);

    expect(n1.getNoComponents()).toBe(4);
    expect(n1.asString()).toBe("a.b.c.d");
  });

  it("equality and hashCode consistent with StringName", () => {
    const arrayName = new StringArrayName(["oss", "cs", "fau", "de"], ".");
    const stringName = new StringName("oss.cs.fau.de", ".");

    expect(arrayName.isEqual(stringName)).toBe(true);
    expect(stringName.isEqual(arrayName)).toBe(true);

    expect(arrayName.getHashCode()).toBe(stringName.getHashCode());
  });

  it("clone produces equal but independent copy", () => {
    const original = new StringArrayName(["a", "b"], ".");
    const clone = original.clone();

    expect(clone.isEqual(original)).toBe(true);

    // تغییر در clone نباید original را عوض کند
    clone.setComponent(1, "x");
    expect(original.getComponent(1)).toBe("b");
    expect(clone.getComponent(1)).toBe("x");
  });
});
