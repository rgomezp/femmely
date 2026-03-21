import { auth, signIn } from "@/lib/auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  const session = await auth();
  const sp = await searchParams;
  const callbackUrl = sp.callbackUrl ?? "/admin";
  if (session?.user) {
    redirect(callbackUrl);
  }

  async function loginAction(formData: FormData) {
    "use server";
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const cb = (formData.get("callbackUrl") as string) || "/admin";
    const errUrl = `/admin/login?error=1&callbackUrl=${encodeURIComponent(cb)}`;
    try {
      const res = await signIn("credentials", { email, password, redirect: false });
      if (!res || res.error || !res.ok) {
        redirect(errUrl);
      }
      redirect(cb);
    } catch (e) {
      if (e instanceof AuthError && e.type === "CredentialsSignin") {
        redirect(errUrl);
      }
      throw e;
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
        <h1 className="text-xl font-semibold">Admin sign in</h1>
        <p className="mt-1 text-sm text-neutral-500">Femmely dashboard</p>
        {sp.error === "1" ? (
          <p className="mt-3 text-sm text-red-600">Invalid email or password.</p>
        ) : null}
        <form action={loginAction} className="mt-6 space-y-4">
          <input type="hidden" name="callbackUrl" value={callbackUrl} />
          <div>
            <label className="text-sm font-medium" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="username"
              className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2"
            />
          </div>
          <div>
            <label className="text-sm font-medium" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-xl bg-[#e8485c] py-2.5 text-sm font-semibold text-white"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
