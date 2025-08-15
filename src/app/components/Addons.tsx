"use client";
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
    TouchSensor,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { AlertTriangle, Copy, ExternalLink, GripVertical } from "lucide-react";
import { useState } from "react";
import { Addon } from "../types/addon";


type Props = {
    addons: Addon[];
    onChange: (newAddons: Addon[]) => void;
};

function SortableAddonItem({
    id,
    name,
    is_protected,
    is_configurable,
    checked,
    toggleAddonCheck,
}: Addon & { toggleAddonCheck: (id: string) => void }) {
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="flex items-center justify-between text-gray-300 bg-gray-800 px-3 py-2 rounded-lg shadow"
        >
            <label className="flex items-center space-x-2 select-none">
                <input
                    type="checkbox"
                    checked={checked}
                    disabled={is_protected}
                    onChange={() => toggleAddonCheck(id)}
                    className="h-5 w-5 border-2 border-gray-400 rounded-sm bg-gray-700 checked:bg-blue-500 checked:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer transition-all"
                />
                <span>
                    {name}
                    {is_protected && " (Protected)"}
                </span>
            </label>

            {/* Drag handle */}
            <div className="flex items-center space-x-2">
                {/* Open link button */}
                {!is_configurable ? (
                    <span
                        className="text-gray-500 opacity-50 cursor-not-allowed p-1"
                        title="Protected addon – link disabled"
                    >
                        <ExternalLink size={18} />
                    </span>
                ) : (
                    <a
                        href={id.replace("/manifest.json", "/configure")} // change to actual addon link
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-white p-1"
                        aria-label="Open addon link"
                    >
                        <ExternalLink size={18} />
                    </a>
                )}

                {/* Copy button */}
                <button
                    onClick={() => navigator.clipboard.writeText(id)}
                    className="text-gray-400 hover:text-white p-1"
                    aria-label="Copy addon ID"
                >
                    <Copy size={18} />
                </button>

                {/* Drag handle */}
                <button
                    {...attributes}
                    {...listeners}
                    className="text-gray-400 hover:text-white cursor-grab active:cursor-grabbing p-1"
                    aria-label="Drag handle"
                >
                    <GripVertical size={18} />
                </button>
            </div>
        </div>
    );
}

export default function AddonsDragAndDrop({ addons, onChange }: Props) {
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5, // drag starts after moving 5px (prevents accidental drags on click)
            },
        }),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 200, // long-press delay (ms) before drag starts
                tolerance: 5,
            },
        })
    );
    const [showWarning, setShowWarning] = useState(false);

    const toggleAddonCheck = (id: string) => {
        const updated = addons.map((addon) =>
            addon.id === id ? { ...addon, checked: !addon.checked } : addon
        );
        onChange(updated);
    };

    const handleDragEnd = ({ active, over }: DragEndEvent) => {
        if (!over) return; // handle null case

        if (active.id !== over.id) {
            const oldIndex = addons.findIndex((a) => a.id === active.id);
            const newIndex = addons.findIndex((a) => a.id === over.id);
            const updated = arrayMove(addons, oldIndex, newIndex);

            // Check if a protected addon was moved from the first position
            const firstBefore = addons[0];
            if (firstBefore.is_protected && updated[0].id !== firstBefore.id) {
                setShowWarning(true);
            } else {
                setShowWarning(false);
            }

            onChange(updated);
        }
    };


    return (
        <div className="space-y-3">
            {showWarning && (
                <div className="flex items-start space-x-2 bg-yellow-500 text-black p-3 rounded-lg shadow-md">
                    <AlertTriangle className="flex-shrink-0 mt-0.5" size={20} />
                    <p className="text-sm leading-snug">
                        Moving a protected addon may break Stremio functionality!
                    </p>
                </div>
            )}
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={addons.map((a) => a.id)}
                    strategy={verticalListSortingStrategy}
                >
                    <div className="mt-3 space-y-2">
                        {addons.map((addon) => (
                            <SortableAddonItem
                                key={addon.id}
                                {...addon}
                                toggleAddonCheck={toggleAddonCheck}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>
        </div>
    );
}
