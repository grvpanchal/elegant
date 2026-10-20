import { describe, it, expect } from "vitest";
import { iconSrc } from "./icons";

describe("iconSrc", () => {
  const svgOf = (src) => decodeURIComponent(src.replace("data:image/svg+xml,", ""));

  it("draws every icon the atoms ask for without a network request", () => {
    ["edit", "trash-2", "x", "info", "alert-triangle"].forEach((name) => {
      const src = iconSrc(name, 16, "ffffff");
      expect(src.startsWith("data:image/svg+xml,")).toBe(true);
      expect(svgOf(src)).toMatch(/<(path|line|circle|polyline) /);
    });
  });

  it("takes the size and the hex colour the icongr.am URL took", () => {
    const svg = svgOf(iconSrc("x", 16, "ffffff"));
    expect(svg).toContain('width="16"');
    expect(svg).toContain('stroke="#ffffff"');
  });

  it("draws black when the colour is empty or not a hex colour", () => {
    expect(svgOf(iconSrc("x", 24, ""))).toContain('stroke="#000000"');
    expect(svgOf(iconSrc("x", 24, "light"))).toContain('stroke="#000000"');
  });
});
