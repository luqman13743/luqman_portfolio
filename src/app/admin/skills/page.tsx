"use client";

import AdminShell from "@/components/admin/AdminShell";
import AdminCrudManager, { FieldConfig } from "@/components/admin/AdminCrudManager";

const fields: FieldConfig[] = [
  { name: "name", label: "Skill name", type: "text", required: true, placeholder: "Gram Staining" },
  {
    name: "category",
    label: "Category",
    type: "text",
    required: true,
    placeholder: "Microbiology & Laboratory Skills",
    helpText: "Skills with the same category are grouped together on the site.",
  },
];

const emptyDefaults = { name: "", category: "", order: 0 };

export default function SkillsAdminPage() {
  return (
    <AdminShell>
      <AdminCrudManager
        apiPath="/api/admin/skills"
        fields={fields}
        emptyDefaults={emptyDefaults}
        titleField="name"
        subtitleFields={["category"]}
        hasOrder
        entityLabel="skill"
        entityLabelPlural="Skills"
      />
    </AdminShell>
  );
}
