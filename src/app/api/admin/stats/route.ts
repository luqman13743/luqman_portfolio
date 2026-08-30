import { NextResponse } from "next/server";
import { requireAdminOrResponse, isResponse } from "@/lib/api-helpers";
import { listEducation, listExperience, listSkills, listProjects, listCertifications, listDocuments, listMessages } from "@/lib/repo";

export async function GET() {
  const auth = await requireAdminOrResponse();
  if (isResponse(auth)) return auth;

  const messages = await listMessages();
  return NextResponse.json({
    education: (await listEducation()).length,
    experience: (await listExperience()).length,
    skills: (await listSkills()).length,
    projects: (await listProjects()).length,
    certifications: (await listCertifications()).length,
    documents: (await listDocuments()).length,
    messages: messages.length,
    unreadMessages: messages.filter((m) => !m.isRead).length,
  });
}
