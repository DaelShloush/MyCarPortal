import { describe, it, expect } from "vitest";
import { getManufacturerSlug } from "../manufacturer-logos";

describe("getManufacturerSlug", () => {
  it("maps a plain Hebrew make", () => {
    expect(getManufacturerSlug("טויוטה")).toBe("toyota");
  });

  it("matches by substring when there's a country suffix", () => {
    expect(getManufacturerSlug("טויוטה יפן")).toBe("toyota");
    expect(getManufacturerSlug('הונדה-ארה"ב')).toBe("honda");
  });

  it("picks the brand even when it's the second token", () => {
    expect(getManufacturerSlug("מרוטי-סוזוקי")).toBe("suzuki");
  });

  it("resolves multi-word brands", () => {
    expect(getManufacturerSlug("מרצדס בנץ גרמנ")).toBe("mercedes-benz");
  });

  it("falls back to lowercased English input", () => {
    expect(getManufacturerSlug("Toyota")).toBe("toyota");
  });

  it("returns empty string for empty input", () => {
    expect(getManufacturerSlug("")).toBe("");
  });
});
