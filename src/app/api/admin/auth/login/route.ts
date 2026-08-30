import { NextRequest, NextResponse } from "next/server";
import { loginSchema, rateLimit, clientKeyFromHeaders } from "@/lib/validation";
import { findAdminByEmail, touchAdminLogin } from "@/lib/repo";
import { verifyPassword, createSessionToken, setSessionCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const key = clientKeyFromHeaders(req.headers, "login");
  if (!rateLimit(key, 8, 10 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many login attempts. Please try again later." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Enter a valid email and password." }, { status: 400 });
  }

  const { email, password } = parsed.data;
  const admin = await findAdminByEmail(email);

  // Always run bcrypt.compare even on a missing user, against a dummy hash,
  // so response timing doesn't reveal whether the email exists.
  const dummyHash = "$2a$12$CwTycUXWue0Thq9StjUM0uJ8gT2sXjmqEJHYlhu6BbFXTx0YYqZfa";
  const ok = await verifyPassword(password, admin?.passwordHash ?? dummyHash);

  if (!admin || !ok) {
    return NextResponse.json({ error: "Incorrect email or password." }, { status: 401 });
  }

  await touchAdminLogin(admin.id);
  const token = await createSessionToken(admin.id);
  await setSessionCookie(token);

  return NextResponse.json({ ok: true });
}
