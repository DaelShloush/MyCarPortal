import { describe, it, expect } from "vitest";
import { flag, gearboxLabel } from "../api/vehicle-aggregator";

describe("flag (flexible truthy check for data.gov.il)", () => {
  it("treats string and number 1, 'Y', and true as truthy", () => {
    expect(flag("1")).toBe(true);
    expect(flag(1)).toBe(true);
    expect(flag("Y")).toBe(true);
    expect(flag(true)).toBe(true);
  });
  it("treats everything else as false", () => {
    expect(flag("0")).toBe(false);
    expect(flag(0)).toBe(false);
    expect(flag("")).toBe(false);
    expect(flag(undefined)).toBe(false);
    expect(flag(null)).toBe(false);
  });
});

describe("gearboxLabel", () => {
  it("maps string \"1\" to אוטומטית (data.gov.il sometimes returns strings)", () => {
    expect(gearboxLabel("1", true)).toBe("אוטומטית");
  });
  it("maps number 1 to אוטומטית", () => {
    expect(gearboxLabel(1, true)).toBe("אוטומטית");
  });
  it("maps a falsy flag to ידנית when spec exists", () => {
    expect(gearboxLabel("0", true)).toBe("ידנית");
    expect(gearboxLabel(undefined, true)).toBe("ידנית");
  });
  it("returns empty string when there is no spec at all", () => {
    expect(gearboxLabel(undefined, false)).toBe("");
    expect(gearboxLabel("1", false)).toBe("");
  });
});
