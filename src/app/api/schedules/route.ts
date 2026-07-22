// src/app/api/schedules/route.ts
// Returns all studio schedules for the homepage timetable.
// Called client-side from page.tsx HomePage via useEffect.

import { NextResponse } from "next/server";
import { fetchAllSchedules } from "@/lib/queries/classQueries";

export const revalidate = 3600; // 1h

export async function GET(): Promise<NextResponse> {
  try {
    const schedules = await fetchAllSchedules();
    return NextResponse.json(schedules, {
      headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" },
    });
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}
