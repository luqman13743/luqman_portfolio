"use client";

import AdminShell from "@/components/admin/AdminShell";
import AdminCrudManager, { FieldConfig } from "@/components/admin/AdminCrudManager";

const fields: FieldConfig[] = [
  { name: "degree", label: "Degree / Certificate", type: "text", required: true, placeholder: "BS (Hons) in Microbiology" },
  { name: "institution", label: "Institution", type: "text", required: true, placeholder: "Kohat University of Science and Technology" },
  { name: "fieldOfStudy", label: "Field of study", type: "text", placeholder: "Microbiology" },
  { name: "city", label: "City", type: "text" },
  { name: "country", label: "Country", type: "text" },
  { name: "startDate", label: "Start date", type: "date", required: true },
  { name: "endDate", label: "End date", type: "date", required: true },
  { name: "details", label: "Additional details", type: "textarea", placeholder: "Optional — coursework, honors, thesis, etc." },
];

const emptyDefaults = {
  degree: "",
  institution: "",
  fieldOfStudy: "",
  city: "",
  country: "",
  startDate: "",
  endDate: "",
  details: "",
  order: 0,
};

export default function EducationAdminPage() {
  return (
    <AdminShell>
      <AdminCrudManager
        apiPath="/api/admin/education"
        fields={fields}
        emptyDefaults={emptyDefaults}
        titleField="degree"
        subtitleFields={["institution"]}
        hasOrder
        entityLabel="education entry"
        entityLabelPlural="Education"
      />
    </AdminShell>
  );
}
