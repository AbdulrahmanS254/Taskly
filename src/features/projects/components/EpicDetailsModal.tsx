import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

import {
    getEpicDetails,
    updateEpic,
    type Epic,
    type EpicUpdate,
    type EpicUser,
} from '../services/epicService';
import {
    getProjectMembers,
    type ProjectMember,
} from '../services/membersService';
import { getInitials } from '../../../utils/helpers';
import {
    IconAlert,
    IconCalendar,
    IconClose,
    IconEpics,
    IconMembers,
    IconPlus,
    IconTasks,
} from '../../../components/ui/icons';

interface EpicDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    projectId: string;
    epicId: string | null;
    // Receives the updated epic so the parent list can patch it in place.
    // A plain `() => void` handler is still assignable here.
    onEpicUpdated?: (updatedEpic: Epic) => void;
}

type EditableField =
    | 'title'
    | 'description'
    | 'assignee_id'
    | 'deadline';

const metaLabel =
    'text-[10px] font-bold uppercase leading-[15px] text-slate-900/40';
const metaBox =
    'flex items-center gap-2 border border-surface-highest rounded-lg p-2';

/**
 * Date-only strings (YYYY-MM-DD) are returned as-is: routing them through
 * `new Date()` treats them as UTC midnight and shifts the day backwards in
 * negative-offset timezones.
 */
function parseDate(value: string): Date | null {
    const dateOnly = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (dateOnly) {
        return new Date(
            Number(dateOnly[1]),
            Number(dateOnly[2]) - 1,
            Number(dateOnly[3])
        );
    }
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function formatFullDate(value: string | null | undefined): string {
    if (!value) return '—';
    const date = parseDate(value);
    if (!date) return '—';
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

function toDateInputValue(value: string | null | undefined): string {
    if (!value) return '';
    const match = value.match(/^\d{4}-\d{2}-\d{2}/);
    if (match) return match[0];
    const date = parseDate(value);
    if (!date) return '';
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${date.getFullYear()}-${month}-${day}`;
}

function getErrorMessage(err: unknown, fallback: string): string {
    if (err instanceof Error) return err.message || fallback;
    return fallback;
}

// The result is tagged with the epic it belongs to, so a result left over from
// a previously opened epic is never rendered against a newly selected one.
interface DetailsResult {
    epicId: string;
    loading: boolean;
    error: string | null;
    epic: Epic | null;
}

export default function EpicDetailsModal({
    isOpen,
    onClose,
    projectId,
    epicId,
    onEpicUpdated,
}: EpicDetailsModalProps) {
    const [result, setResult] = useState<DetailsResult | null>(null);
    const [members, setMembers] = useState<ProjectMember[]>([]);
    const [membersLoading, setMembersLoading] = useState(false);

    // Tracks the most recent request so a slow earlier response can't
    // overwrite a newer one.
    const latestRequestRef = useRef<string | null>(null);

    const fetchDetails = useCallback(async () => {
        if (!epicId) return;

        latestRequestRef.current = epicId;
        setResult({
            epicId,
            loading: true,
            error: null,
            epic: null,
        });

        try {
            const data = await getEpicDetails(projectId, epicId);
            if (latestRequestRef.current !== epicId) return;
            setResult({
                epicId,
                loading: false,
                error: data ? null : 'This epic could not be found.',
                epic: data,
            });
        } catch (err: unknown) {
            if (latestRequestRef.current !== epicId) return;
            setResult({
                epicId,
                loading: false,
                error: getErrorMessage(
                    err,
                    'Failed to load epic details'
                ),
                epic: null,
            });
        }
    }, [projectId, epicId]);

    useEffect(() => {
        if (!isOpen || !epicId) return;
        fetchDetails();
    }, [isOpen, epicId, fetchDetails]);

    // Members populate the assignee dropdown.
    useEffect(() => {
        if (!isOpen || !projectId) return;

        let cancelled = false;
        setMembersLoading(true);

        getProjectMembers(projectId)
            .then((data) => {
                if (!cancelled) setMembers(data);
            })
            .catch(() => {
                if (!cancelled) setMembers([]);
            })
            .finally(() => {
                if (!cancelled) setMembersLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [isOpen, projectId]);

    // Close on Escape and lock background scroll while open.
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };

        document.addEventListener('keydown', handleKeyDown);
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = previousOverflow;
        };
    }, [isOpen, onClose]);

    // Merges a saved change into the locally held epic.
    const handleEpicPatched = useCallback((patch: Partial<Epic>) => {
        setResult((prev) =>
            prev && prev.epic
                ? { ...prev, epic: { ...prev.epic, ...patch } }
                : prev
        );
    }, []);

    if (!isOpen) return null;

    const current =
        result && result.epicId === epicId ? result : null;
    // No matching result yet means the fetch is still being kicked off.
    const loading = current?.loading ?? true;
    const error = current?.error ?? null;
    const epic = current?.epic ?? null;

    return (
        <div
            onClick={onClose}
            role="presentation"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-slate-900/20 backdrop-blur-[2px]"
        >
            <div
                onClick={(event) => event.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-label="Epic details"
                className="bg-white w-full max-w-[672px] max-h-[90vh] rounded-lg shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] flex flex-col overflow-hidden"
            >
                {/* Header */}
                <div className="border-b border-slate-300/15 px-5 pt-6 pb-6 md:px-8 md:pt-8 shrink-0">
                    <div className="flex items-center gap-2">
                        <IconEpics className="size-5 text-primary shrink-0" />
                        <span className="flex-1 text-xs font-bold uppercase tracking-[0.6px] text-slate-900/60">
                            {epic?.epic_id || 'Epic'}
                        </span>
                        <button
                            type="button"
                            onClick={onClose}
                            aria-label="Close epic details"
                            className="size-[30px] rounded-xl flex items-center justify-center text-slate-500 hover:bg-surface-low transition cursor-pointer shrink-0"
                        >
                            <IconClose />
                        </button>
                    </div>

                    {loading || !epic ? (
                        <div className="mt-4 border border-surface-highest rounded-xl p-3">
                            <div className="h-8 w-2/3 bg-[#e8edff] rounded animate-pulse" />
                        </div>
                    ) : null}
                </div>

                {/* Body */}
                <div className="flex flex-col gap-6 md:gap-8 p-5 md:p-8 overflow-y-auto">
                    {error && (
                        <div className="flex flex-col items-center text-center py-6">
                            <div className="bg-[#ffdad6] rounded-xl size-12 flex items-center justify-center mb-4">
                                <IconAlert className="size-6 text-error" />
                            </div>
                            <p className="text-slate-500 text-sm mb-5">
                                {error}
                            </p>
                            <button
                                type="button"
                                onClick={() => fetchDetails()}
                                className="bg-primary text-white font-semibold text-sm px-5 py-2 rounded-sm hover:opacity-90 transition cursor-pointer"
                            >
                                Try Again
                            </button>
                        </div>
                    )}

                    {!error && loading && <EpicDetailsSkeleton />}

                    {!error && !loading && epic && (
                        // Keyed so each epic gets a fresh set of draft values.
                        <EpicDetailsBody
                            key={epic.id}
                            epic={epic}
                            members={members}
                            membersLoading={membersLoading}
                            onEpicPatched={handleEpicPatched}
                            onEpicUpdated={onEpicUpdated}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

interface EpicDetailsBodyProps {
    epic: Epic;
    members: ProjectMember[];
    membersLoading: boolean;
    onEpicPatched: (patch: Partial<Epic>) => void;
    onEpicUpdated?: (updatedEpic: Epic) => void;
}

function EpicDetailsBody({
    epic,
    members,
    membersLoading,
    onEpicPatched,
    onEpicUpdated,
}: EpicDetailsBodyProps) {
    // Draft values drive the inputs; `epic` always holds the last saved state,
    // so it doubles as the comparison baseline and the revert target.
    const [title, setTitle] = useState(epic.title);
    const [description, setDescription] = useState(
        epic.description ?? ''
    );
    const [assigneeId, setAssigneeId] = useState(
        epic.assignee?.id ?? ''
    );
    const [deadline, setDeadline] = useState(
        toDateInputValue(epic.deadline)
    );
    const [savingField, setSavingField] =
        useState<EditableField | null>(null);
    const [isEditingAssignee, setIsEditingAssignee] =
        useState(false);

    const saveField = async (
        field: EditableField,
        updates: EpicUpdate,
        patch: Partial<Epic>,
        revert: () => void
    ) => {
        setSavingField(field);
        try {
            await updateEpic(epic.id, updates);
            onEpicPatched(patch);
            toast.success('Epic updated');
            onEpicUpdated?.({ ...epic, ...patch });
        } catch {
            revert();
            toast.error(
                'Failed to update epic. Please try again.'
            );
        } finally {
            setSavingField(null);
        }
    };

    const handleTitleBlur = () => {
        const trimmed = title.trim();
        // Title is required — an empty value reverts instead of saving.
        if (!trimmed) {
            setTitle(epic.title);
            return;
        }
        if (trimmed === epic.title) return;
        saveField(
            'title',
            { title: trimmed },
            { title: trimmed },
            () => setTitle(epic.title)
        );
    };

    const handleDescriptionBlur = () => {
        const trimmed = description.trim();
        const original = epic.description ?? '';
        if (trimmed === original.trim()) return;
        saveField(
            'description',
            { description: trimmed },
            { description: trimmed || null },
            () => setDescription(original)
        );
    };

    const handleAssigneeChange = (value: string) => {
        const original = epic.assignee?.id ?? '';
        setAssigneeId(value);
        setIsEditingAssignee(false);
        if (value === original) return;

        const member = members.find((m) => m.user_id === value);
        const nextAssignee: EpicUser | null = member
            ? {
                  id: member.user_id,
                  name: member.metadata?.name || member.email,
              }
            : null;

        saveField(
            'assignee_id',
            { assignee_id: value },
            { assignee: nextAssignee },
            () => setAssigneeId(original)
        );
    };

    const handleDeadlineChange = (value: string) => {
        const original = toDateInputValue(epic.deadline);
        setDeadline(value);
        if (value === original) return;
        saveField(
            'deadline',
            { deadline: value },
            { deadline: value || null },
            () => setDeadline(original)
        );
    };

    const assigneeName = epic.assignee?.name;

    return (
        <>
            {/* Title */}
            <div className="-mt-2 md:-mt-4">
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onBlur={handleTitleBlur}
                    disabled={savingField === 'title'}
                    aria-label="Epic title"
                    className="w-full border border-surface-highest rounded-xl p-3 text-xl font-bold text-slate-900 leading-8 focus:outline-none focus:border-primary transition disabled:opacity-60"
                />
            </div>

            {/* Description */}
            <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={handleDescriptionBlur}
                disabled={savingField === 'description'}
                placeholder="No description provided"
                rows={4}
                aria-label="Epic description"
                className="w-full border border-surface-highest rounded-xl p-3 min-h-[150px] text-base leading-[26px] text-slate-900 placeholder:text-slate-muted focus:outline-none focus:border-primary transition resize-none disabled:opacity-60"
            />

            {/* Meta grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div className="flex flex-col gap-2">
                    <span className={metaLabel}>Created By</span>
                    <div className="flex items-center gap-2">
                        <div className="bg-primary-container text-white size-7 rounded-xl flex items-center justify-center text-[10px] font-bold shrink-0">
                            {getInitials(epic.created_by?.name) ||
                                '--'}
                        </div>
                        <span className="text-sm font-medium text-slate-900 truncate">
                            {epic.created_by?.name || 'Unknown'}
                        </span>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <span className={metaLabel}>Assignee</span>
                    {isEditingAssignee ? (
                        <select
                            autoFocus
                            value={assigneeId}
                            onChange={(e) =>
                                handleAssigneeChange(e.target.value)
                            }
                            onBlur={() => setIsEditingAssignee(false)}
                            disabled={
                                savingField === 'assignee_id' ||
                                membersLoading
                            }
                            aria-label="Epic assignee"
                            className="w-full border border-surface-highest rounded-lg p-2 h-10 text-sm font-medium text-slate-900 bg-white focus:outline-none focus:border-primary transition cursor-pointer disabled:opacity-60"
                        >
                            <option value="">
                                {membersLoading
                                    ? 'Loading members...'
                                    : 'Unassigned'}
                            </option>
                            {members.map((member) => (
                                <option
                                    key={member.member_id}
                                    value={member.user_id}
                                >
                                    {member.metadata?.name ||
                                        member.email}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <button
                            type="button"
                            onClick={() =>
                                setIsEditingAssignee(true)
                            }
                            disabled={savingField === 'assignee_id'}
                            aria-label="Change assignee"
                            className={`${metaBox} w-full h-10 text-left hover:border-primary transition cursor-pointer disabled:opacity-60`}
                        >
                            {assigneeName ? (
                                <>
                                    <div className="bg-[#cdddff] text-[#51617e] size-6 rounded-xl flex items-center justify-center text-[10px] font-bold shrink-0">
                                        {getInitials(assigneeName)}
                                    </div>
                                    <span className="text-sm font-medium text-slate-900 truncate">
                                        {assigneeName}
                                    </span>
                                </>
                            ) : (
                                <>
                                    <div className="bg-surface-highest text-slate-muted size-6 rounded-xl flex items-center justify-center shrink-0">
                                        <IconMembers className="size-3" />
                                    </div>
                                    <span className="text-sm font-medium text-slate-muted">
                                        Unassigned
                                    </span>
                                </>
                            )}
                        </button>
                    )}
                </div>

                <div className="flex flex-col gap-2">
                    <span className={metaLabel}>Deadline</span>
                    <div
                        className={`${metaBox} h-10 focus-within:border-primary transition`}
                    >
                        <IconCalendar className="size-3.5 text-primary shrink-0" />
                        <input
                            type="date"
                            value={deadline}
                            onChange={(e) =>
                                handleDeadlineChange(e.target.value)
                            }
                            disabled={savingField === 'deadline'}
                            aria-label="Epic deadline"
                            className="w-full bg-transparent text-sm font-medium text-slate-900 focus:outline-none cursor-pointer disabled:opacity-60"
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <span className={metaLabel}>Created At</span>
                    <div className="flex items-center gap-2 h-10">
                        <IconCalendar className="size-3.5 text-primary shrink-0" />
                        <span className="text-sm font-medium text-slate-900">
                            {formatFullDate(epic.created_at)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Tasks (static) */}
            <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-900 leading-7">
                        Epic Tasks
                    </h3>
                    <button
                        type="button"
                        className="flex items-center gap-1 px-3 py-1.5 rounded-sm text-sm font-semibold text-primary hover:bg-surface-low transition cursor-pointer"
                    >
                        <IconPlus className="size-2.5" />
                        Add Task
                    </button>
                </div>

                <div className="bg-surface-low border-2 border-dashed border-slate-300/30 rounded-lg px-6 py-10 md:p-[50px] flex flex-col items-center">
                    <div className="bg-surface-highest rounded-xl size-12 flex items-center justify-center">
                        <IconTasks className="size-[18px] text-primary" />
                    </div>
                    <p className="pt-4 text-base font-medium text-slate-900 text-center leading-6">
                        No tasks have been added to this epic yet
                    </p>
                    <button
                        type="button"
                        className="mt-4 flex items-center gap-2 bg-linear-to-br from-primary to-primary-container text-white font-semibold text-base px-6 py-2.5 rounded-sm shadow-[0px_1px_1px_0px_rgba(0,0,0,0.05)] hover:opacity-90 transition cursor-pointer"
                    >
                        <IconPlus className="size-3.5" />
                        Add Task
                    </button>
                </div>
            </div>
        </>
    );
}

function EpicDetailsSkeleton() {
    const bar = 'bg-[#e8edff] rounded-sm animate-pulse';

    return (
        <div className="flex flex-col gap-8">
            <div className={`h-[150px] w-full rounded-xl ${bar}`} />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex flex-col gap-2">
                        <div className={`h-3 w-16 ${bar}`} />
                        <div
                            className={`h-10 w-full rounded-lg ${bar}`}
                        />
                    </div>
                ))}
            </div>
            <div className="flex flex-col gap-6">
                <div className={`h-7 w-32 ${bar}`} />
                <div className={`h-40 w-full rounded-lg ${bar}`} />
            </div>
        </div>
    );
}
