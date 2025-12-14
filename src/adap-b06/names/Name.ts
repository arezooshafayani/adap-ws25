import { Equality } from "../common/Equality";
import { Cloneable } from "../common/Cloneable";
import { Printable } from "../common/Printable";

/**
 * A name is a sequence of string components separated by a delimiter character.
 * Special characters within the string may need masking, if they are to appear verbatim.
 * There are only two special characters, the delimiter character and the escape character.
 * The escape character can't be set, the delimiter character can.
 *
 * Homogenous name examples
 *
 * "oss.cs.fau.de" is a name with four name components and the delimiter character '.'.
 * "///" is a name with four empty components and the delimiter character '/'.
 * "Oh\.\.\." is a name with one component, if the delimiter character is '.'.
 */
export interface Name extends Printable, Equality {
  /**
   * Returns true, if number of components == 0; else false
   */
  isEmpty(): boolean;

  /**
   * Returns number of components in Name instance
   */
  getNoComponents(): number;

  /**
   * Returns the i-th component
   */
  getComponent(i: number): string;

  /**
   * Returns a new Name with the component at index i replaced
   */
  setComponent(i: number, c: string): Name;

  /**
   * Returns a new Name with a component inserted at index i
   */
  insert(i: number, c: string): Name;

  /**
   * Returns a new Name with the component appended
   */
  append(c: string): Name;

  /**
   * Returns a new Name with the component at index i removed
   */
  remove(i: number): Name;

  /**
   * Returns a new Name that is the concatenation of this and other
   */
  concat(other: Name): Name;
}
