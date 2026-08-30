import { NextRequest, NextResponse } from "next/server";
import { setupSchema, rateLimit, clientKeyFromHeaders } from "@/lib/validation";
import { countAdmins, createAdmin } from "@/lib/repo";
import { hashPassword, createSessionToken, setSessionCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const key = clientKeyFromHeaders(req.headers, "setup");
  if (!rateLimit(key, 5, 15 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many attempts. Please try again later." }, { status: 429 });
  }

  if (await countAdmins() > 0) {
    return NextResponse.json(
      { error: "An administrator account already exists. Please log in instead." },
      { status: 409 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = setupSchema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as string;
      if (field && !fieldErrors[field]) fieldErrors[field] = issue.message;
    }
    return NextResponse.json({ error: "Please check the form.", fieldErrors }, { status: 400 });
  }

  const { name, email, password } = parsed.data;
  const passwordHash = await hashPassword(password);
  const admin = await createAdmin(email, passwordHash, name);

  const token = await createSessionToken(admin.id);
  await setSessionCookie(token);

  return NextResponse.json({ ok: true });
}
