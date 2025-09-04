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
import {
    AlertTriangle,
    Copy,
    ExternalLink,
    GripVertical,
    Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Addon } from "../types/addon";

type Props = {
    addons: Addon[];
    onChange: (newAddons: Addon[]) => void;
};

function SortableAddonItemNoCheck({
    id, // manifest URL
    uuid, // unique drag-and-drop ID
    name,
    is_protected,
    is_configurable,
    requestDelete,
}: Addon & {
    requestDelete: (uuid: string) => void;
}) {
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id: uuid });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="flex items-center justify-between text-gray-300 bg-gray-800 px-3 py-2 rounded-lg shadow select-none touch-none"
        >
            <span>
                {name}
                {is_protected && " (Protected)"}
            </span>

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
                        href={id.replace("/manifest.json", "/configure")}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-white p-1"
                        aria-label="Open addon link"
                        title="Open addon configuration page"
                    >
                        <ExternalLink size={18} />
                    </a>
                )}

                {/* Copy manifest URL */}
                <button
                    onClick={() => navigator.clipboard.writeText(id)}
                    className="text-gray-400 hover:text-white p-1"
                    aria-label="Copy manifest URL to clipboard"
                    title="Copy manifest URL to clipboard"
                >
                    <Copy size={18} />
                </button>

                {/* Delete (by uuid) */}
                <button
                    onClick={() => !is_protected && requestDelete(uuid)}
                    disabled={is_protected}
                    className={`p-1 ${is_protected
                        ? "text-gray-500 opacity-50 cursor-not-allowed"
                        : "text-red-400 hover:text-red-600"
                        }`}
                    aria-label="Delete addon"
                    title={
                        is_protected
                            ? "Protected addon cannot be deleted"
                            : "Delete this addon"
                    }
                >
                    <Trash2 size={18} />
                </button>

                {/* Drag handle */}
                <button
                    type="button"
                    {...attributes}
                    {...listeners}
                    className="text-gray-400 hover:text-white cursor-grab active:cursor-grabbing p-1 touch-none"
                    aria-label="Drag handle"
                    title="Drag to reorder addons"
                >
                    <GripVertical size={18} />
                </button>
            </div>
        </div>
    );
}

export default function AddonsDragAndDropNoCheck({ addons, onChange }: Props) {
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 5 },
        }),
        useSensor(TouchSensor, {
            activationConstraint: { delay: 250, tolerance: 10 },
        })
    );

    const [showWarning, setShowWarning] = useState(false);
    const [addonToDelete, setAddonToDelete] = useState<string | null>(null);

    useEffect(() => {
        document.body.style.overflow = addonToDelete ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [addonToDelete]);

    const handleDragEnd = ({ active, over }: DragEndEvent) => {
        if (!over) return;

        if (active.id !== over.id) {
            const oldIndex = addons.findIndex((a) => a.uuid === active.id);
            const newIndex = addons.findIndex((a) => a.uuid === over.id);
            const updated = arrayMove(addons, oldIndex, newIndex);

            // Warn if protected addon moved from first spot
            const firstBefore = addons[0];
            if (firstBefore.is_protected && updated[0].uuid !== firstBefore.uuid) {
                setShowWarning(true);
            } else {
                setShowWarning(false);
            }

            onChange(updated);
        }
    };

    const handleDelete = (uuid: string) => {
        onChange(addons.filter((addon) => addon.uuid !== uuid));
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
                    items={addons.map((a) => a.uuid)}
                    strategy={verticalListSortingStrategy}
                >
                    <div className="mt-3 space-y-2">
                        {addons.map((addon) => (
                            <SortableAddonItemNoCheck
                                key={addon.uuid}
                                {...addon}
                                requestDelete={(uuid) => setAddonToDelete(uuid)}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>

            {addonToDelete && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-gray-800 p-6 rounded-xl shadow-lg w-80 text-gray-200">
                        <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
                        <p className="mb-6 text-sm">
                            Are you sure you want to delete this addon?
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setAddonToDelete(null)}
                                className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-500"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    handleDelete(addonToDelete);
                                    setAddonToDelete(null);
                                }}
                                className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
