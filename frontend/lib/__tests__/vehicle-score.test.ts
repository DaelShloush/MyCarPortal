import { describe, it, expect } from "vitest";
import { computeVehicleScore } from "../vehicle-score";
import type { Vehicle, Owner } from "../types";

// רכב "נקי" לבדיקות — כל הדגלים כבויים, נתונים מלאים
function makeVehicle(overrides: Partial<Vehicle> = {}): Vehicle {
  const year = new Date().getFullYear() - 5; // בן 5
  return {
    id: "123",
    plate: "1234567",
    manufacturer: "טויוטה יפן",
    manufacturerSlug: "toyota",
    manufacturerCountry: "יפן",
    model: "COROLLA",
    year,
    color: "לבן",
    fuelType: "בנזין",
    yad: 2,
    engineCC: 1600,
    horsepower: 120,
    drivetrain: "",
    gearbox: "אוטומטית",
    bodyType: "סדאן",
    doors: 4,
    seats: 5,
    weightKg: 1400,
    towingKg: 0,
    firstRegistrationDate: "01/01/2021",
    testLastDate: "01/01/2026",
    testExpiryDate: "01/01/2027",
    testExpired: false,
    kmAtLastTest: 60000, // 12,000 לשנה — מתחת לממוצע
    structuralChange: false,
    colorChanged: false,
    towHook: false,
    tireChanged: false,
    owners: [
      { date: "01/2021", type: "פרטי", durationMonths: 36 },
      { date: "01/2024", type: "פרטי", current: true },
    ] as Owner[],
    recalls: [],
    safety: {
      airbags: 6, abs: true, esp: true, laneAssist: false, collisionWarning: false,
      pedestrianDetect: false, reverseCamera: true, emergencyBrake: false,
      blindSpot: false, autoLights: false, safetyScore: 0,
    },
    greenScore: 0,
    pollutionGroup: 0,
    co2: 120,
    nox: 0,
    tireFront: "",
    tireRear: "",
    loadFront: 0,
    loadRear: 0,
    speedRating: "",
    speedRatingRear: "",
    hasDisabilityTag: false,
    status: "active",
    ...overrides,
  };
}

describe("computeVehicleScore", () => {
  it("gives a clean vehicle a perfect score", () => {
    const result = computeVehicleScore(makeVehicle());
    expect(result.score).toBe(100);
    expect(result.grade.label).toBe("מצוין");
    expect(result.checks.every((c) => c.status !== "flag")).toBe(true);
  });

  it("every check has a non-empty explanation", () => {
    const result = computeVehicleScore(makeVehicle());
    for (const check of result.checks) {
      expect(check.explanation.length).toBeGreaterThan(10);
    }
  });

  it("heavily deducts a decommissioned vehicle", () => {
    const result = computeVehicleScore(makeVehicle({ status: "decommissioned" }));
    expect(result.score).toBe(40);
    expect(result.grade.tone).toBe("bad");
  });

  it("deducts for taxi history", () => {
    const result = computeVehicleScore(
      makeVehicle({ isPublicVehicle: true, publicVehicleType: "מונית" })
    );
    expect(result.score).toBe(80);
    const check = result.checks.find((c) => c.id === "public");
    expect(check?.status).toBe("flag");
    expect(check?.detail).toBe("מונית");
  });

  it("deducts for open recalls + structural change cumulatively", () => {
    const result = computeVehicleScore(
      makeVehicle({
        recalls: [{ id: "1", description: "x", openedAt: "2024", open: true }],
        structuralChange: true,
      })
    );
    expect(result.score).toBe(100 - 15 - 12);
    expect(result.grade.label).toBe("טוב");
  });

  it("flags leasing origin", () => {
    const result = computeVehicleScore(
      makeVehicle({
        owners: [
          { date: "01/2021", type: "החכר (ליסינג)", durationMonths: 30 },
          { date: "07/2023", type: "פרטי", current: true },
        ] as Owner[],
      })
    );
    expect(result.checks.find((c) => c.id === "origin")?.status).toBe("flag");
    expect(result.score).toBe(92);
  });

  it("flags above-average annual km", () => {
    // בן 5 עם 120,000 ק"מ = 24,000 לשנה (מעל סף 18,750)
    const result = computeVehicleScore(makeVehicle({ kmAtLastTest: 120000 }));
    const check = result.checks.find((c) => c.id === "km");
    expect(check?.status).toBe("flag");
    expect(result.score).toBe(92);
  });

  it("marks ownership checks as na when no history (pre-2017)", () => {
    const result = computeVehicleScore(makeVehicle({ owners: [], yad: 0 }));
    expect(result.checks.find((c) => c.id === "origin")?.status).toBe("na");
    expect(result.checks.find((c) => c.id === "short-owners")?.status).toBe("na");
    expect(result.checks.find((c) => c.id === "yad")?.status).toBe("na");
    // אין מידע ≠ עבירה — לא יורדות נקודות
    expect(result.score).toBe(100);
  });

  it("never goes below zero", () => {
    const result = computeVehicleScore(
      makeVehicle({
        status: "decommissioned",
        isPublicVehicle: true,
        recalls: [{ id: "1", description: "x", openedAt: "2024", open: true }],
        structuralChange: true,
        colorChanged: true,
        testExpired: true,
        kmAtLastTest: 200000,
        yad: 6,
        owners: [
          { date: "01/2021", type: "השכרה", durationMonths: 6 },
          { date: "07/2021", type: "פרטי", durationMonths: 6 },
          { date: "01/2022", type: "פרטי", durationMonths: 6 },
          { date: "07/2022", type: "פרטי", current: true },
        ] as Owner[],
      })
    );
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.grade.tone).toBe("bad");
  });
});
