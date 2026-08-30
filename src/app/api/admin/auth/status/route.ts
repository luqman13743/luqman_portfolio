import { NextResponse } from "next/server";
import { countAdmins } from "@/lib/repo";
import { getSessionAdminId } from "@/lib/auth";

export async function GET() {
  const needsSetup = await countAdmins() === 0;
  const adminId = await getSessionAdminId();
  return NextResponse.json({ needsSetup, authenticated: !!adminId });
}
