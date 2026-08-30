"use client";

import AdminShell from "@/components/admin/AdminShell";
import AdminCrudManager, { FieldConfig } from "@/components/admin/AdminCrudManager";

const fields: FieldConfig[] = [
  { name: "title", label: "Certificate title", type: "text", required: true },
  { name: "issuer", label: "Issuing organization", type: "text", required: true },
  { name: "date", label: "Date", type: "date" },
  { name: "verificationUrl", label: "Verification link", type: "url", placeholder: "https://…" },
];

const emptyDefaults = { title: "", issuer: "", date: "", verificationUrl: "", order: 0 };

export default function CertificationsAdminPage() {
  return (
    <AdminShell>
      <AdminCrudManager
        apiPath="/api/admin/certifications"
        fields={fields}
        emptyDefaults={emptyDefaults}
        titleField="title"
        subtitleFields={["issuer"]}
        hasOrder
        entityLabel="certificate"
        entityLabelPlural="Certifications"
      />
      <p className="mt-6 text-sm text-ink/50">
        To attach a certificate file (PDF or image), upload it first in{" "}
        <a href="/admin/documents" className="font-medium text-teal-700 underline">
          Documents
        </a>
        , then paste its file link into the verification link field above.
      </p>
    </AdminShell>
  );
}
