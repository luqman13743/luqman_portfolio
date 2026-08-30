import { NextResponse } from "next/server";
import { getSessionAdminId } from "./auth";

export async function requireAdminOrResponse(): Promise<string | NextResponse> {
  const id = await getSessionAdminId();
  if (!id) {
    return NextResponse.json({ error: "Unauthorized. Please log in again." }, { status: 401 });
  }
  return id;
}

export function isResponse(x: unknown): x is NextResponse {
  return x instanceof NextResponse;
}

export function zodFieldErrors(error: { issues: { path: (string | number)[]; message: string }[] }) {
  const fieldErrors: Record<string, string> = {};
  for (const issue of error.issues) {
    const field = issue.path[0] as string;
    if (field && !fieldErrors[field]) fieldErrors[field] = issue.message;
  }
  return fieldErrors;
}
