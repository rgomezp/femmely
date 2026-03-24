import { adminPasswordHashFromEnv } from "@/lib/admin-password";
import { amazonConfigured, amazonCreatorsCredentialsConfigured } from "@/lib/amazon";
import {
  getAmazonPartnerTagEnv,
  getAmazonPartnerTagOverrideRaw,
  getAmazonPartnerTagResolved,
} from "@/lib/site-settings";
import { SettingsPartnerTagForm } from "@/components/admin/SettingsPartnerTagForm";

export default async function AdminSettingsPage() {
  const dbOk = Boolean(process.env.DATABASE_URL);
  const authOk = Boolean(process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET);
  const adminOk = Boolean(process.env.ADMIN_EMAIL?.trim() && adminPasswordHashFromEnv());
  const blobOk = Boolean(process.env.BLOB_READ_WRITE_TOKEN);

  const [envDefault, overrideRaw, effective, amazonOk, credsOk] = await Promise.all([
    Promise.resolve(getAmazonPartnerTagEnv()),
    getAmazonPartnerTagOverrideRaw(),
    getAmazonPartnerTagResolved(),
    amazonConfigured(),
    Promise.resolve(amazonCreatorsCredentialsConfigured()),
  ]);

  const overrideLabel =
    overrideRaw === null
      ? "None (using environment)"
      : overrideRaw === ""
        ? 'Stored as empty (no "tag" on built links)'
        : `Stored override: ${overrideRaw}`;

  return (
    <div className="max-w-2xl space-y-6">
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
          <span>ADMIN_EMAIL + ADMIN_PASSWORD_HASH / ADMIN_PASSWORD_HASH_B64</span>
          <span className={adminOk ? "text-emerald-600" : "text-red-600"}>{adminOk ? "Set" : "Missing"}</span>
        </li>
        <li className="flex justify-between">
          <span>BLOB_READ_WRITE_TOKEN</span>
          <span className={blobOk ? "text-emerald-600" : "text-amber-600"}>{blobOk ? "Set" : "Optional"}</span>
        </li>
        <li className="flex justify-between">
          <span>Amazon Creators API credentials</span>
          <span className={credsOk ? "text-emerald-600" : "text-amber-600"}>
            {credsOk ? "Set" : "Not configured"}
          </span>
        </li>
        <li className="flex justify-between">
          <span>Amazon Creators API (credentials + partner tag)</span>
          <span className={amazonOk ? "text-emerald-600" : "text-amber-600"}>
            {amazonOk ? "Ready" : "Not ready"}
          </span>
        </li>
      </ul>

      <div className="space-y-2 rounded-2xl border border-neutral-200 bg-neutral-50/80 p-4 text-sm text-neutral-700">
        <p>
          <span className="font-medium text-neutral-900">Partner tag source:</span> {overrideLabel}
        </p>
        <p>
          <span className="font-medium text-neutral-900">Effective tag in use:</span>{" "}
          <span className="font-mono text-neutral-800">{effective ? effective : "(empty)"}</span>
        </p>
        <p className="text-xs text-neutral-500">
          Live product data from the Creators API is cached for about an hour; affiliate URLs in the database update
          immediately when you use the bulk rewrite option.
        </p>
      </div>

      <SettingsPartnerTagForm
        key={`${effective}|${envDefault}`}
        envDefault={envDefault}
        initialEffective={effective}
      />
    </div>
  );
}
