/**
 * deepClone(value)
 *
 * - plain objects and arrays are copied recursively, sharing no reference
 * - Date, Map and Set clone as their own types
 * - primitives, null and functions come back as-is
 * - a cyclic structure clones without hanging, and keeps its cycle
 * - an object appearing twice clones to the SAME object twice
 */
export default function deepClone(value) {
  throw new Error("not implemented");
}
