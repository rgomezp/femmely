"use client";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Image from "next/image";
import { GarmentCategorySelect } from "./GarmentCategorySelect";

export type DraftOutfitItem = {
  tempId: string;
  serverId?: string;
  asin: string;
  title: string;
  affiliateUrl: string;
  imageUrl: string;
  priceCents: number | null;
  currency: string;
  displayLabel: string;
  garmentCategory: string;
};

function SortableRow({
  item,
  onChange,
  onRemove,
}: {
  item: DraftOutfitItem;
  onChange: (id: string, patch: Partial<DraftOutfitItem>) => void;
  onRemove: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.tempId,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="rounded-2xl border border-neutral-200 bg-white p-4">
      <div className="flex flex-col gap-3 md:flex-row">
        <button
          type="button"
          className="h-10 w-10 shrink-0 cursor-grab rounded-lg border border-neutral-200 text-neutral-400"
          {...attributes}
          {...listeners}
          aria-label="Drag to reorder"
        >
          ::
        </button>
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-neutral-100">
          {item.imageUrl ? (
            <Image src={item.imageUrl} alt="" fill className="object-contain" sizes="96px" />
          ) : null}
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <input
            value={item.title}
            onChange={(e) => onChange(item.tempId, { title: e.target.value })}
            className="w-full rounded-lg border border-neutral-200 px-2 py-1 text-sm font-medium"
          />
          <div className="grid gap-2 sm:grid-cols-2">
            <div>
              <label className="text-xs text-neutral-500">Label</label>
              <input
                value={item.displayLabel}
                onChange={(e) => onChange(item.tempId, { displayLabel: e.target.value })}
                className="mt-0.5 w-full rounded-lg border border-neutral-200 px-2 py-1 text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-neutral-500">Sizing</label>
              <GarmentCategorySelect
                value={item.garmentCategory}
                onChange={(v) => onChange(item.tempId, { garmentCategory: v })}
              />
            </div>
          </div>
          <p className="truncate text-xs text-neutral-400">ASIN {item.asin}</p>
        </div>
        <button
          type="button"
          onClick={() => onRemove(item.tempId)}
          className="shrink-0 self-start text-sm text-red-600"
        >
          Remove
        </button>
      </div>
    </div>
  );
}

export function ItemSortableList({
  items,
  onReorder,
  onChange,
  onRemove,
}: {
  items: DraftOutfitItem[];
  onReorder: (items: DraftOutfitItem[]) => void;
  onChange: (id: string, patch: Partial<DraftOutfitItem>) => void;
  onRemove: (id: string) => void;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function handleDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIndex = items.findIndex((i) => i.tempId === active.id);
    const newIndex = items.findIndex((i) => i.tempId === over.id);
    if (oldIndex < 0 || newIndex < 0) return;
    onReorder(arrayMove(items, oldIndex, newIndex));
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items.map((i) => i.tempId)} strategy={verticalListSortingStrategy}>
        <div className="space-y-3">
          {items.map((item) => (
            <SortableRow key={item.tempId} item={item} onChange={onChange} onRemove={onRemove} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
