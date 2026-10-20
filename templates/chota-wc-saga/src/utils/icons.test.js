import { expect } from "@open-wc/testing";
import { iconSrc } from "./icons";

describe("iconSrc", () => {
  const svgOf = (src) => decodeURIComponent(src.replace("data:image/svg+xml,", ""));

  it("draws every icon the atoms ask for without a network request", () => {
    ["edit", "trash-2", "x", "info", "alert-triangle"].forEach((name) => {
      const src = iconSrc(name, 16, "ffffff");
      expect(src.startsWith("data:image/svg+xml,")).to.equal(true);
      expect(svgOf(src)).to.match(/<(path|line|circle|polyline) /);
    });
  });

  it("takes the size and the hex colour the icongr.am URL took", () => {
    const svg = svgOf(iconSrc("x", 16, "ffffff"));
    expect(svg).to.include('width="16"');
    expect(svg).to.include('stroke="#ffffff"');
  });

  it("draws black when the colour is empty or not a hex colour", () => {
    expect(svgOf(iconSrc("x", 24, ""))).to.include('stroke="#000000"');
    expect(svgOf(iconSrc("x", 24, "light"))).to.include('stroke="#000000"');
  });
});
