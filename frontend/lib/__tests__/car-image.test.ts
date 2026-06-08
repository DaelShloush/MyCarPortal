import { describe, it, expect } from "vitest";
import { buildCarImageUrl } from "../car-image";

describe("buildCarImageUrl", () => {
  it("returns null without a recognizable manufacturer", () => {
    expect(buildCarImageUrl({ manufacturer: "", model: "X" })).toBeNull();
  });

  it("builds a Mercedes URL mapping C250 → c-class", () => {
    const url = buildCarImageUrl({ manufacturer: "מרצדס בנץ גרמנ", model: "C250", year: 2014 })!;
    expect(url).toContain("make=mercedes-benz");
    expect(url).toContain("modelFamily=c-class");
    expect(url).toContain("modelYear=2014");
  });

  it("maps BMW 320I → 3-series", () => {
    const url = buildCarImageUrl({ manufacturer: "ב.מ.וו", model: "320I" })!;
    expect(url).toContain("make=bmw");
    expect(url).toContain("modelFamily=3-series");
  });

  it("maps Lexus NX200T → nx", () => {
    const url = buildCarImageUrl({ manufacturer: "לקסוס יפן", model: "NX200T" })!;
    expect(url).toContain("modelFamily=nx");
  });

  it("keeps mainstream model names as-is (Corolla)", () => {
    const url = buildCarImageUrl({ manufacturer: "טויוטה יפן", model: "COROLLA" })!;
    expect(url).toContain("modelFamily=corolla");
  });

  it("maps a Hebrew color to an English paintDescription", () => {
    const url = buildCarImageUrl({ manufacturer: "טויוטה", model: "COROLLA", color: "כחול מטאלי" })!;
    expect(url).toContain("paintDescription=blue");
  });
});
