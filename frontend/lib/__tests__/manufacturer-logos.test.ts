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

  it("does NOT match a brand inside a country word (טורקיה ≠ קיה)", () => {
    // באג אמיתי: "רנו טורקיה" קיבלה לוגו KIA כי "טורקיה" מסתיימת ב"קיה"
    expect(getManufacturerSlug("רנו טורקיה")).toBe("renault");
    expect(getManufacturerSlug("פיאט טורקיה")).toBe("fiat");
    expect(getManufacturerSlug("פולקסווגן סלובקיה")).toBe("volkswagen");
  });

  it("still matches kia itself", () => {
    expect(getManufacturerSlug("קיה קוריאה")).toBe("kia");
    expect(getManufacturerSlug("קיה")).toBe("kia");
  });

  it("matches the actual data.gov.il spelling of volvo", () => {
    expect(getManufacturerSlug("וולבו שוודיה")).toBe("volvo");
  });

  it("matches actual data.gov.il spellings: סיטרואן and מ.ג", () => {
    expect(getManufacturerSlug("סיטרואן ספרד")).toBe("citroen");
    expect(getManufacturerSlug("מ.ג סין")).toBe("mg");
  });

  it("falls back to lowercased English input", () => {
    expect(getManufacturerSlug("Toyota")).toBe("toyota");
  });

  it("returns empty string for empty input", () => {
    expect(getManufacturerSlug("")).toBe("");
  });
});
