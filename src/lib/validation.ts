import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Name is too short").max(120),
  email: z.string().trim().email("Enter a valid email address").max(200),
  subject: z.string().trim().min(2, "Subject is too short").max(200),
  message: z.string().trim().min(10, "Message is too short").max(5000),
  // Honeypot field: real users never fill this in (hidden via CSS).
  website: z.string().max(0).optional().or(z.literal("")),
});

export const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8),
});

export const setupSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const educationSchema = z.object({
  degree: z.string().trim().min(1),
  institution: z.string().trim().min(1),
  city: z.string().trim().nullable().default(null),
  country: z.string().trim().nullable().default(null),
  startDate: z.string().trim().min(1),
  endDate: z.string().trim().min(1),
  fieldOfStudy: z.string().trim().nullable().default(null),
  details: z.string().trim().nullable().default(null),
  order: z.number().int().default(0),
});

export const experienceSchema = z.object({
  position: z.string().trim().min(1),
  organization: z.string().trim().min(1),
  location: z.string().trim().nullable().default(null),
  startDate: z.string().trim().min(1),
  endDate: z.string().trim().min(1),
  responsibilities: z.string().trim().min(1),
  skillsUsed: z.string().trim().default(""),
  order: z.number().int().default(0),
});

export const skillSchema = z.object({
  name: z.string().trim().min(1),
  category: z.string().trim().min(1),
  order: z.number().int().default(0),
});

export const projectSchema = z.object({
  title: z.string().trim().min(1),
  description: z.string().trim().min(1),
  role: z.string().trim().nullable().default(null),
  methods: z.string().trim().default(""),
  date: z.string().trim().nullable().default(null),
  externalUrl: z.string().trim().url().nullable().or(z.literal("")).default(null),
  documentId: z.string().trim().nullable().default(null),
  order: z.number().int().default(0),
});

export const certificationSchema = z.object({
  title: z.string().trim().min(1),
  issuer: z.string().trim().min(1),
  date: z.string().trim().nullable().default(null),
  verificationUrl: z.string().trim().url().nullable().or(z.literal("")).default(null),
  documentId: z.string().trim().nullable().default(null),
  order: z.number().int().default(0),
});

export const documentMetaSchema = z.object({
  title: z.string().trim().min(1),
  description: z.string().trim().nullable().default(null),
  category: z.string().trim().min(1),
  externalUrl: z.string().trim().url().nullable().or(z.literal("")).default(null),
  isPublic: z.boolean().default(true),
});

export const profileSchema = z.object({
  name: z.string().trim().min(1),
  title: z.string().trim().min(1),
  summary: z.string().trim().min(1),
  aboutBody: z.string().trim().min(1),
  researchInterests: z.string().trim().default(""),
  careerInterests: z.string().trim().default(""),
  keyStrengths: z.string().trim().default(""),
  profileImageUrl: z.string().trim().nullable().default(null),
  email: z.string().trim().email().nullable().or(z.literal("")).default(null),
  phone: z.string().trim().nullable().default(null),
  location: z.string().trim().nullable().default(null),
  linkedin: z.string().trim().url().nullable().or(z.literal("")).default(null),
  github: z.string().trim().url().nullable().or(z.literal("")).default(null),
  otherLinkLabel: z.string().trim().nullable().default(null),
  otherLinkUrl: z.string().trim().url().nullable().or(z.literal("")).default(null),
  cvDocumentId: z.string().trim().nullable().default(null),
});

export const gallerySchema = z.object({
  title: z.string().trim().default(""),
  imageUrl: z.string().trim().min(1),
  caption: z.string().trim().nullable().default(null),
  order: z.number().int().default(0),
  isPublic: z.boolean().default(true),
});

export const navigationSchema = z.object({
  label: z.string().trim().min(1),
  href: z.string().trim().min(1),
  order: z.number().int().default(0),
  isVisible: z.boolean().default(true),
});

export const settingsSchema = z.object({
  siteTitle: z.string().trim().min(1),
  metaDescription: z.string().trim().default(""),
  ogImageUrl: z.string().trim().nullable().default(null),
  primaryColorNote: z.string().trim().default(""),
});

// ---------------------------------------------------------------------------
// Minimal in-memory rate limiter (per server process). Good enough for a
// single-instance deployment; for multi-instance production, swap for a
// shared store (e.g. Redis / Upstash) keyed the same way.
// ---------------------------------------------------------------------------

const buckets = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (bucket.count >= limit) return false;
  bucket.count += 1;
  return true;
}

export function clientKeyFromHeaders(headers: Headers, suffix: string): string {
  const ip =
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    "unknown";
  return `${ip}:${suffix}`;
}
