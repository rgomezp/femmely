"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { FeaturedTooltipHint } from "./FeaturedTooltipHint";
import { AsinLookup } from "./AsinLookup";
import { ImageDropzone } from "./ImageDropzone";
import { ItemSortableList, type DraftOutfitItem } from "./ItemSortableList";

type Cat = { id: string; name: string };
type Tg = { id: string; name: string };

type OutfitRow = {
  id: string;
  title: string;
  description: string;
  mainImageUrl: string;
  status: "draft" | "published";
  featured: boolean;
  season: string | null;
  occasion: string | null;
  sortOrder: number;
};

export function OutfitForm({
  mode,
  outfit,
  initialItems,
  initialCategoryIds,
  initialTagIds,
  categories,
  tags: tagsProp,
}: {
  mode: "create" | "edit";
  outfit?: OutfitRow;
  initialItems?: DraftOutfitItem[];
  initialCategoryIds?: string[];
  initialTagIds?: string[];
  categories: Cat[];
  tags: Tg[];
}) {
  const router = useRouter();
  const [tags, setTags] = useState(tagsProp);
  const [title, setTitle] = useState(outfit?.title ?? "");
  const [description, setDescription] = useState(outfit?.description ?? "");
  const [mainImageUrl, setMainImageUrl] = useState(outfit?.mainImageUrl ?? "");
  const [, setStatus] = useState<"draft" | "published">(outfit?.status ?? "draft");
  const [featured, setFeatured] = useState(outfit?.featured ?? false);
  const [season, setSeason] = useState(outfit?.season ?? "");
  const [occasion, setOccasion] = useState(outfit?.occasion ?? "");
  const [sortOrder, setSortOrder] = useState(outfit?.sortOrder ?? 0);
  const [catIds, setCatIds] = useState<Set<string>>(new Set(initialCategoryIds ?? []));
  const [tagIds, setTagIds] = useState<Set<string>>(new Set(initialTagIds ?? []));
  const [items, setItems] = useState<DraftOutfitItem[]>(initialItems ?? []);
  const [deletedServerIds, setDeletedServerIds] = useState<string[]>([]);
  const [newTagName, setNewTagName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(1);

  const previewItems = useMemo(() => {
    return items.map((it, idx) => ({ ...it, sortOrder: idx }));
  }, [items]);

  function toggle(set: Set<string>, id: string) {
    const n = new Set(set);
    if (n.has(id)) n.delete(id);
    else n.add(id);
    return n;
  }

  async function createTag() {
    if (!newTagName.trim()) return;
    const res = await fetch("/api/admin/tags", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newTagName.trim() }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error?.message ?? "Could not create tag");
      return;
    }
    setTags((t) => [...t, data.tag].sort((a, b) => a.name.localeCompare(b.name)));
    setTagIds((s) => new Set(s).add(data.tag.id));
    setNewTagName("");
  }

  async function save(publish: boolean) {
    setError(null);
    setSaving(true);
    try {
      if (!title.trim()) throw new Error("Title required");
      if (publish && !mainImageUrl.trim()) {
        throw new Error("Upload a main outfit image before publishing (used in browse grids)");
      }
      const st = publish ? "published" : "draft";

      if (mode === "create") {
        const res = await fetch("/api/admin/outfits", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: title.trim(),
            description,
            mainImageUrl,
            status: st,
            featured,
            season: season || null,
            occasion: occasion || null,
            sortOrder,
            categoryIds: [...catIds],
            tagIds: [...tagIds],
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(JSON.stringify(data.error) || "Save failed");
        const oid = data.outfit.id as string;
        for (let i = 0; i < previewItems.length; i++) {
          const it = previewItems[i];
          const ir = await fetch(`/api/admin/outfits/${oid}/items`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              asin: it.asin,
              title: it.title,
              affiliateUrl: it.affiliateUrl,
              imageUrl: it.imageUrl,
              priceCents: it.priceCents,
              currency: it.currency,
              displayLabel: it.displayLabel,
              garmentCategory: it.garmentCategory,
              sortOrder: i,
            }),
          });
          if (!ir.ok) throw new Error("Failed to save an item");
        }
        await fetch("/api/admin/revalidate", { method: "POST", body: JSON.stringify({}) });
        router.push("/admin/outfits");
        router.refresh();
        return;
      }

      const oid = outfit!.id;
      const res = await fetch(`/api/admin/outfits/${oid}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description,
          mainImageUrl,
          status: st,
          featured,
          season: season || null,
          occasion: occasion || null,
          sortOrder,
          categoryIds: [...catIds],
          tagIds: [...tagIds],
        }),
      });
      if (!res.ok) throw new Error("Update failed");
      setStatus(st);

      for (const sid of deletedServerIds) {
        await fetch(`/api/admin/outfits/${oid}/items?itemId=${sid}`, { method: "DELETE" });
      }

      for (let i = 0; i < previewItems.length; i++) {
        const it = previewItems[i];
        const body = {
          asin: it.asin,
          title: it.title,
          affiliateUrl: it.affiliateUrl,
          imageUrl: it.imageUrl,
          priceCents: it.priceCents,
          currency: it.currency,
          displayLabel: it.displayLabel,
          garmentCategory: it.garmentCategory,
          sortOrder: i,
        };
        if (it.serverId) {
          await fetch(`/api/admin/outfits/${oid}/items`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ itemId: it.serverId, ...body }),
          });
        } else {
          await fetch(`/api/admin/outfits/${oid}/items`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          });
        }
      }

      await fetch("/api/admin/revalidate", { method: "POST", body: JSON.stringify({}) });
      router.push("/admin/outfits");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div className="flex gap-2 text-sm">
        {[1, 2, 3].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStep(s)}
            className={`rounded-full px-3 py-1 ${step === s ? "bg-neutral-900 text-white" : "bg-neutral-200"}`}
          >
            {s === 1 ? "Info" : s === 2 ? "Items" : "Review"}
          </button>
        ))}
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      {step === 1 ? (
        <section className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-6">
          <h2 className="font-semibold">Basic info</h2>
          <div>
            <label className="text-sm font-medium">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2"
            />
          </div>
          <div>
            <p className="text-sm font-medium">Main image</p>
            <p className="mt-1 text-xs text-neutral-500">
              Shown on the home page, browse grids, and at the top of the outfit page. Upload a styled cover photo
              (Vercel Blob).
            </p>
            {mainImageUrl ? (
              <p className="mt-2 break-all text-xs text-neutral-500">
                Current:{" "}
                <a href={mainImageUrl} className="text-[#e8485c] underline">
                  link
                </a>
              </p>
            ) : null}
            <ImageDropzone label="Upload main image" onUploaded={setMainImageUrl} />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium">Season</label>
              <input
                value={season}
                onChange={(e) => setSeason(e.target.value)}
                placeholder="summer"
                className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Occasion</label>
              <input
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
                placeholder="date night"
                className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Description (Markdown)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
              className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2 font-mono text-sm"
            />
            <div className="mt-2 max-w-none rounded-xl border border-neutral-100 bg-neutral-50 p-3 text-sm text-neutral-700 [&_a]:text-[#e8485c] [&_a]:underline">
              <Markdown remarkPlugins={[remarkGfm]}>{description || "*Nothing to preview*"}</Markdown>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium">Categories</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {categories.map((c) => (
                <label key={c.id} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={catIds.has(c.id)}
                    onChange={() => setCatIds((s) => toggle(s, c.id))}
                  />
                  {c.name}
                </label>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium">Tags</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {tags.map((t) => (
                <label key={t.id} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={tagIds.has(t.id)}
                    onChange={() => setTagIds((s) => toggle(s, t.id))}
                  />
                  {t.name}
                </label>
              ))}
            </div>
            <div className="mt-3 flex gap-2">
              <input
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                placeholder="New tag"
                className="flex-1 rounded-xl border border-neutral-200 px-3 py-2 text-sm"
              />
              <button type="button" onClick={createTag} className="rounded-xl bg-neutral-200 px-3 text-sm">
                Add tag
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <label className="flex cursor-pointer items-center gap-2">
              <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
              Featured in outfit carousel
            </label>
            <FeaturedTooltipHint />
          </div>
          <div>
            <label className="text-sm font-medium">Sort order</label>
            <input
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(Number(e.target.value))}
              className="mt-1 w-32 rounded-xl border border-neutral-200 px-3 py-2"
            />
          </div>
        </section>
      ) : null}

      {step === 2 ? (
        <section className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-6">
          <h2 className="font-semibold">Items</h2>
          <p className="text-sm text-neutral-600">
            Add products by ASIN. Amazon images appear in the outfit sidebar and on item detail pages.
          </p>
          <AsinLookup
            onProduct={(p) =>
              setItems((prev) => [
                ...prev,
                {
                  tempId: crypto.randomUUID(),
                  asin: p.asin,
                  title: p.title,
                  affiliateUrl: p.affiliateUrl,
                  imageUrl: p.imageUrl ?? "",
                  priceCents: p.priceCents,
                  currency: p.currency,
                  displayLabel: "Item",
                  garmentCategory: "none",
                },
              ])
            }
          />
          <ItemSortableList
            items={items}
            onReorder={setItems}
            onChange={(id, patch) =>
              setItems((prev) => prev.map((i) => (i.tempId === id ? { ...i, ...patch } : i)))
            }
            onRemove={(tempId) => {
              const it = items.find((i) => i.tempId === tempId);
              if (it?.serverId) setDeletedServerIds((d) => [...d, it.serverId!]);
              setItems((prev) => prev.filter((i) => i.tempId !== tempId));
            }}
          />
        </section>
      ) : null}

      {step === 3 ? (
        <section className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-6">
          <h2 className="font-semibold">Review</h2>
          <p className="text-sm text-neutral-600">
            <strong>{title}</strong> · {items.length} items · will save as draft or published below
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={saving}
              onClick={() => {
                setStatus("draft");
                save(false);
              }}
              className="rounded-xl border border-neutral-300 px-4 py-2 text-sm font-medium"
            >
              Save draft
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={() => save(true)}
              className="rounded-xl bg-[#e8485c] px-4 py-2 text-sm font-semibold text-white"
            >
              Publish
            </button>
          </div>
        </section>
      ) : null}

      {step < 3 ? (
        <button
          type="button"
          onClick={() => setStep((s) => Math.min(3, s + 1))}
          className="rounded-xl bg-neutral-900 px-4 py-2 text-sm text-white"
        >
          Next
        </button>
      ) : null}
    </div>
  );
}
