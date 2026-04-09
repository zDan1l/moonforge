import type { ReactNode } from "react";

export type BadgeVariant =
	| "draft"
	| "generated"
	| "refined"
	| "template"
	| "ai"
	| "modified";

export interface BadgeProps {
	variant: BadgeVariant;
	children: ReactNode;
	className?: string;
	size?: "sm" | "md";
}

const variantClasses: Record<BadgeVariant, string> = {
	draft:
		"bg-[var(--chip-bg)] text-[var(--sea-ink-soft)] border-[var(--chip-line)]",
	generated: "bg-[var(--palm)]/10 text-[var(--palm)] border-[var(--palm)]/30",
	refined:
		"bg-[var(--lagoon)]/10 text-[var(--lagoon-deep)] border-[var(--lagoon)]/30",
	template:
		"bg-[var(--chip-bg)] text-[var(--sea-ink-soft)] border-[var(--chip-line)]",
	ai: "bg-[var(--lagoon)]/15 text-[var(--lagoon-deep)] border-[var(--lagoon)]/35",
	modified: "bg-[var(--palm)]/15 text-[var(--palm)] border-[var(--palm)]/35",
};

const sizeClasses = {
	sm: "px-1.5 py-0.5 text-[10px]",
	md: "px-2 py-0.5 text-xs",
};

export function Badge({
	variant,
	children,
	className = "",
	size = "md",
}: BadgeProps) {
	return (
		<span
			className={`inline-flex items-center rounded-full border font-medium ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
		>
			{children}
		</span>
	);
}

// Convenience component for project status
export interface StatusBadgeProps {
	status: "draft" | "generated" | "refined";
	size?: "sm" | "md";
}

const statusLabels: Record<StatusBadgeProps["status"], string> = {
	draft: "Draft",
	generated: "Generated",
	refined: "Refined",
};

export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
	return (
		<Badge variant={status} size={size}>
			{statusLabels[status]}
		</Badge>
	);
}

// Convenience component for file source badges
export interface FileSourceBadgeProps {
	source: "template" | "ai_generated" | "modified";
	size?: "sm" | "md";
}

const sourceLabels: Record<FileSourceBadgeProps["source"], string> = {
	template: "[T]",
	ai_generated: "[AI]",
	modified: "[Modified]",
};

const sourceVariants: Record<FileSourceBadgeProps["source"], BadgeVariant> = {
	template: "template",
	ai_generated: "ai",
	modified: "modified",
};

export function FileSourceBadge({ source, size = "sm" }: FileSourceBadgeProps) {
	return (
		<Badge variant={sourceVariants[source]} size={size}>
			{sourceLabels[source]}
		</Badge>
	);
}
