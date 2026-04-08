import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "#/lib/utils";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
	variant?: "default" | "success" | "warning" | "error" | "info";
}

const badgeVariants = {
	default: "bg-[var(--surface)] text-[var(--sea-ink)] border-[var(--line)]",
	success:
		"bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-100 dark:border-green-700",
	warning:
		"bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-100 dark:border-yellow-700",
	error:
		"bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-100 dark:border-red-700",
	info: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-100 dark:border-blue-700",
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
	({ className, variant = "default", ...props }, ref) => {
		return (
			<span
				ref={ref}
				className={cn(
					"inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border",
					badgeVariants[variant],
					className,
				)}
				{...props}
			/>
		);
	},
);

Badge.displayName = "Badge";
