import { NextRequest, NextResponse } from "next/server";
import { fetchVehicleByPlate } from "@/lib/api/vehicle-aggregator";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ plate: string }> }
) {
  const { plate } = await params;

  if (!/^\d{5,8}$/.test(plate)) {
    return NextResponse.json(
      { error: "מספר רישוי לא תקין. יש להזין 5-8 ספרות." },
      { status: 400 }
    );
  }

  try {
    const result = await fetchVehicleByPlate(plate);

    if (!result) {
      return NextResponse.json(
        { error: "הרכב לא נמצא במאגרי משרד התחבורה." },
        { status: 404 }
      );
    }

    return NextResponse.json(result, {
      headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" },
    });
  } catch (err) {
    console.error("[vehicle API]", err);
    return NextResponse.json(
      { error: "שגיאה בשליפת הנתונים. נסה שוב בעוד מספר שניות." },
      { status: 502 }
    );
  }
}
