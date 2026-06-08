import { describe, it, expect } from "vitest";
import { estimateCurrentValue } from "../value-estimator";

const THIS_YEAR = new Date().getFullYear();

describe("estimateCurrentValue", () => {
  it("returns null without an original price", () => {
    expect(estimateCurrentValue(undefined, 2020, 0)).toBeNull();
    expect(estimateCurrentValue(0, 2020, 0)).toBeNull();
  });

  it("returns null without a year", () => {
    expect(estimateCurrentValue(100000, 0, 0)).toBeNull();
  });

  it("applies ~8% first-year depreciation for a current-year car", () => {
    const e = estimateCurrentValue(100000, THIS_YEAR, 0)!;
    expect(e.mid).toBe(92000); // 100000 * 0.92, rounded to 100s
  });

  it("keeps low < mid < high", () => {
    const e = estimateCurrentValue(150000, THIS_YEAR - 5, 60000)!;
    expect(e.low).toBeLessThan(e.mid);
    expect(e.high).toBeGreaterThan(e.mid);
  });

  it("never drops below the 10% floor", () => {
    const e = estimateCurrentValue(100000, 1990, 0)!; // very old
    expect(e.mid).toBeGreaterThanOrEqual(10000);
  });

  it("penalizes high mileage vs the average", () => {
    const normal = estimateCurrentValue(100000, THIS_YEAR - 5, 75000)!; // ~15k/yr
    const highKm = estimateCurrentValue(100000, THIS_YEAR - 5, 150000)!; // double
    expect(highKm.mid).toBeLessThan(normal.mid);
  });
});
