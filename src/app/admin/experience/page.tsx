"use client";

import AdminShell from "@/components/admin/AdminShell";
import AdminCrudManager, { FieldConfig } from "@/components/admin/AdminCrudManager";

const fields: FieldConfig[] = [
  { name: "position", label: "Position / Title", type: "text", required: true, placeholder: "Microbiology Intern" },
  { name: "organization", label: "Organization", type: "text", required: true, placeholder: "National Institute of Health (NIH)" },
  { name: "location", label: "Location", type: "text", placeholder: "Islamabad, Pakistan" },
  { name: "startDate", label: "Start date", type: "date", required: true },
  { name: "endDate", label: "End date", type: "date", required: true },
  {
    name: "responsibilities",
    label: "Responsibilities",
    type: "textarea",
    required: true,
    placeholder: "One responsibility per line — each becomes a bullet point.",
    helpText: "Put each responsibility on its own line.",
  },
  { name: "skillsUsed", label: "Related skills", type: "text", placeholder: "Comma-separated, e.g. Microscopy, Culture & Streaking" },
];

const emptyDefaults = {
  position: "",
  organization: "",
  location: "",
  startDate: "",
  endDate: "",
  responsibilities: "",
  skillsUsed: "",
  order: 0,
};

export default function ExperienceAdminPage() {
  return (
    <AdminShell>
      <AdminCrudManager
        apiPath="/api/admin/experience"
        fields={fields}
        emptyDefaults={emptyDefaults}
        titleField="position"
        subtitleFields={["organization", "location"]}
        hasOrder
        entityLabel="experience entry"
        entityLabelPlural="Experience"
      />
    </AdminShell>
  );
}
