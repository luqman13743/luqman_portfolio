import { NextResponse } from "next/server";
import { listNavigationItems } from "@/lib/repo";

export async function GET() {
  return NextResponse.json(await listNavigationItems({ visibleOnly: true }));
}
