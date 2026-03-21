import Link from "next/link";
import { signOut } from "@/lib/auth";

const links = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/outfits", label: "Outfits" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/tags", label: "Tags" },
  { href: "/admin/settings", label: "Settings" },
];

export function AdminSidebar() {
  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-neutral-200 bg-white">
      <div className="border-b border-neutral-200 p-4 font-semibold">Femmely Admin</div>
      <nav className="flex flex-1 flex-col gap-1 p-2">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
          >
            {l.label}
          </Link>
        ))}
      </nav>
      <form
        className="border-t border-neutral-200 p-2"
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/admin/login" });
        }}
      >
        <button type="submit" className="w-full rounded-lg px-3 py-2 text-left text-sm text-neutral-500 hover:bg-neutral-100">
          Sign out
        </button>
      </form>
    </aside>
  );
}
