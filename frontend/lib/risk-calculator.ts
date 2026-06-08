import type { Owner, RiskBreakdown } from "./types";

interface RiskInput {
  owners: Owner[];
  year: number;
  testExpiryDate: string;    // "DD/MM/YYYY"
  kmAtLastTest: number;
  structuralChange: boolean;
  openRecallCount: number;
  firstOwnerType?: Owner["type"];
}

export function calculateRisk(input: RiskInput): RiskBreakdown {
  return {
    ownership:  scoreOwnership(input.owners),
    frequency:  scoreFrequency(input.owners),
    age:        scoreAge(input.year),
    test:       scoreTest(input.testExpiryDate),
    km:         scoreKm(input.kmAtLastTest, input.year),
    structural: input.structuralChange ? 10 : 0,
    recalls:    scoreRecalls(input.openRecallCount),
    ownerType:  scoreOwnerType(input.firstOwnerType),
  };
}

// 0-20: number of private owners (dealers don't count)
function scoreOwnership(owners: Owner[]): number {
  const privateCount = owners.filter((o) => o.type === "פרטי").length;
  if (privateCount <= 2) return 0;
  if (privateCount === 3) return 6;
  if (privateCount === 4) return 12;
  if (privateCount === 5) return 16;
  return 20;
}

// 0-10: owners who held the car < 6 months
function scoreFrequency(owners: Owner[]): number {
  const suspicious = owners.filter(
    (o) => o.type === "פרטי" && o.durationMonths !== undefined && o.durationMonths < 6
  ).length;
  return Math.min(suspicious * 3, 10);
}

// 0-15: vehicle age
function scoreAge(year: number): number {
  if (!year) return 0; // שנה לא ידועה — לא מענישים (אחרת age ענק = 15)
  const age = new Date().getFullYear() - year;
  if (age <= 3) return 0;
  if (age <= 7) return 5;
  if (age <= 14) return 10;
  return 15;
}

// 0-15: test validity
function scoreTest(expiryDate: string): number {
  if (!expiryDate) return 15;
  const parts = expiryDate.split("/");
  if (parts.length < 3) return 8;
  const expiry = new Date(
    parseInt(parts[2], 10),
    parseInt(parts[1], 10) - 1,
    parseInt(parts[0], 10)
  );
  const now = new Date();
  const daysLeft = Math.floor((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (daysLeft < 0) return 15;
  if (daysLeft < 90) return 8;
  return 0;
}

// 0-15: km/year
function scoreKm(km: number, year: number): number {
  if (!km || !year) return 0;
  const age = Math.max(1, new Date().getFullYear() - year);
  const kmPerYear = km / age;
  if (kmPerYear < 5000) return 15;     // חשוד מאוד (לפי המפרט: <5K = 15)
  if (kmPerYear <= 20000) return 0;    // סביר
  if (kmPerYear <= 30000) return 8;
  return 15;                           // >30K
}

// 0-10: open recalls
function scoreRecalls(count: number): number {
  if (count === 0) return 0;
  if (count === 1) return 5;
  return 10;
}

// 0-5: first owner type
function scoreOwnerType(type?: Owner["type"]): number {
  if (!type) return 0;
  if (type === "פרטי") return 0;
  if (type === "החכר (ליסינג)" || type === "חברה") return 2;
  return 5;
}
