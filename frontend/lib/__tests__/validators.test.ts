import { describe, it, expect } from "vitest";
import { validatePlate, formatPlate } from "../validators";

describe("validatePlate", () => {
  it("accepts a clean 7-digit plate", () => {
    const r = validatePlate("1234567");
    expect(r.valid).toBe(true);
    expect(r.cleaned).toBe("1234567");
  });

  it("strips hyphens/spaces and validates", () => {
    const r = validatePlate(" 12-345-67 ");
    expect(r.valid).toBe(true);
    expect(r.cleaned).toBe("1234567");
  });

  it("rejects empty input", () => {
    expect(validatePlate("").valid).toBe(false);
  });

  it("rejects too-short (<5 digits)", () => {
    const r = validatePlate("123");
    expect(r.valid).toBe(false);
    expect(r.error).toContain("קצר");
  });

  it("rejects too-long (>8 digits)", () => {
    const r = validatePlate("123456789");
    expect(r.valid).toBe(false);
    expect(r.error).toContain("ארוך");
  });

  it("ignores non-digit characters entirely", () => {
    const r = validatePlate("abc12345xyz");
    expect(r.valid).toBe(true);
    expect(r.cleaned).toBe("12345");
  });
});

describe("formatPlate", () => {
  it("formats 7 digits as XX-XXX-XX", () => {
    expect(formatPlate("1234567")).toBe("12-345-67");
  });
  it("formats 8 digits as XXX-XX-XXX", () => {
    expect(formatPlate("12345678")).toBe("123-45-678");
  });
  it("leaves other lengths as plain digits", () => {
    expect(formatPlate("12345")).toBe("12345");
  });
});
