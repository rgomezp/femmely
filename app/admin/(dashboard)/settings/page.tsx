import { amazonConfigured } from "@/lib/amazon";

export default function AdminSettingsPage() {
  const dbOk = Boolean(process.env.DATABASE_URL);
  const authOk = Boolean(process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET);
  const adminOk = Boolean(process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD_HASH);
  const blobOk = Boolean(process.env.BLOB_READ_WRITE_TOKEN);

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>
      <p className="text-sm text-neutral-600">
        Environment configuration (never commit secrets). Values are not displayed—only whether each appears to be
        set.
      </p>
      <ul className="space-y-2 rounded-2xl border border-neutral-200 bg-white p-4 text-sm">
        <li className="flex justify-between">
          <span>DATABASE_URL</span>
          <span className={dbOk ? "text-emerald-600" : "text-red-600"}>{dbOk ? "Set" : "Missing"}</span>
        </li>
        <li className="flex justify-between">
          <span>NEXTAUTH_SECRET / AUTH_SECRET</span>
          <span className={authOk ? "text-emerald-600" : "text-red-600"}>{authOk ? "Set" : "Missing"}</span>
        </li>
        <li className="flex justify-between">
          <span>ADMIN_EMAIL + ADMIN_PASSWORD_HASH</span>
          <span className={adminOk ? "text-emerald-600" : "text-red-600"}>{adminOk ? "Set" : "Missing"}</span>
        </li>
        <li className="flex justify-between">
          <span>BLOB_READ_WRITE_TOKEN</span>
          <span className={blobOk ? "text-emerald-600" : "text-amber-600"}>{blobOk ? "Set" : "Optional"}</span>
        </li>
        <li className="flex justify-between">
          <span>Amazon PA-API</span>
          <span className={amazonConfigured() ? "text-emerald-600" : "text-amber-600"}>
            {amazonConfigured() ? "Configured" : "Not configured"}
          </span>
        </li>
      </ul>
    </div>
  );
}
