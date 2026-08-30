"use client";

import AdminShell from "@/components/admin/AdminShell";
import AdminCrudManager, { FieldConfig } from "@/components/admin/AdminCrudManager";

const fields: FieldConfig[] = [
  { name: "title", label: "Title", type: "text", required: true },
  { name: "description", label: "Description", type: "textarea", required: true },
  { name: "role", label: "Your role", type: "text", placeholder: "e.g. Lead Researcher" },
  { name: "methods", label: "Technologies / methods", type: "text", placeholder: "Comma-separated" },
  { name: "date", label: "Date", type: "text", placeholder: "e.g. 2025 or Aug 2025" },
  { name: "externalUrl", label: "External link", type: "url", placeholder: "https://…" },
];

const emptyDefaults = {
  title: "",
  description: "",
  role: "",
  methods: "",
  date: "",
  externalUrl: "",
  order: 0,
};

export default function ProjectsAdminPage() {
  return (
    <AdminShell>
      <AdminCrudManager
        apiPath="/api/admin/projects"
        fields={fields}
        emptyDefaults={emptyDefaults}
        titleField="title"
        subtitleFields={["role", "date"]}
        hasOrder
        entityLabel="project"
        entityLabelPlural="Projects"
      />
    </AdminShell>
  );
}
