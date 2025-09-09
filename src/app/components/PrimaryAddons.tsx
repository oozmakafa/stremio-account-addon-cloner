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
    Edit2,
    ExternalLink,
    GripVertical,
    Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Addon } from "../types/addon";
import AddonEditModal from "./AddonEditModal";

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
    checked,
    addon,
    requestDelete,
    onEdit,
}: Addon & {
    requestDelete: (uuid: string) => void;
    onEdit: (addon: Addon) => void;
}) {
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id: uuid });

    const disabled = addon?.transportUrl?.startsWith("disabled:");


    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`flex items-center justify-between px-3 py-2 rounded-lg shadow select-none touch-none
        ${disabled ? "bg-gray-700 text-gray-500 italic" : "bg-gray-800 text-gray-300"}`}
        >
            <span>
                {name}
                {is_protected && " (Protected)"}
                {disabled && " (Disabled)"}
            </span>

            <div className="flex items-center space-x-2">
                {/* Edit button */}
                <button
                    onClick={() =>
                        onEdit({
                            id,
                            uuid,
                            name,
                            is_protected,
                            is_configurable,
                            checked,
                            addon,
                        })
                    }
                    className="text-gray-400 hover:text-blue-400 p-1"
                    aria-label="Edit addon"
                    title="Edit addon"
                >
                    <Edit2 size={18} />
                </button>

                {/* Open link button */}
                {!is_configurable || disabled ? (
                    <span
                        className="text-gray-500 opacity-50 cursor-not-allowed p-1"
                        title={
                            disabled
                                ? "Disabled addon – link disabled"
                                : "Protected addon – link disabled"
                        }
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
                    disabled={disabled}
                    className={`p-1 ${disabled
                        ? "text-gray-500 opacity-50 cursor-not-allowed"
                        : "text-gray-400 hover:text-white"
                        }`}
                    aria-label="Copy manifest URL to clipboard"
                    title={
                        disabled
                            ? "Disabled addon cannot be copied"
                            : "Copy manifest URL to clipboard"
                    }
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
                    disabled={disabled}
                    className={`p-1 ${disabled
                        ? "text-gray-500 opacity-50 cursor-not-allowed"
                        : "text-gray-400 hover:text-white cursor-grab active:cursor-grabbing touch-none"
                        }`}
                    aria-label="Drag handle"
                    title={
                        disabled
                            ? "Disabled addon cannot be reordered"
                            : "Drag to reorder addons"
                    }
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
    const [addonToEdit, setAddonToEdit] = useState<Addon | null>(null);

    useEffect(() => {
        document.body.style.overflow = addonToDelete || addonToEdit ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [addonToDelete, addonToEdit]);

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
                                onEdit={(addon) => setAddonToEdit(addon)}
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

            <AddonEditModal
                addonToEdit={addonToEdit}
                addons={addons}
                onChange={onChange}
                onClose={() => setAddonToEdit(null)}
            />
        </div>
    );
}
