import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "#/lib/utils";

export interface TextareaProps
	extends TextareaHTMLAttributes<HTMLTextAreaElement> {
	error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
	({ className, error, ...props }, ref) => {
		return (
			<textarea
				ref={ref}
				className={cn(
					"flex min-h-[80px] w-full rounded-lg border bg-[var(--surface-strong)] px-3 py-2 text-sm text-[var(--sea-ink)] placeholder:text-[var(--sea-ink-soft)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--lagoon)] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all resize-y",
					error && "border-red-500 focus:ring-red-500",
					!error && "border-[var(--line)] focus:border-[var(--lagoon)]",
					className,
				)}
				{...props}
			/>
		);
	},
);

Textarea.displayName = "Textarea";
