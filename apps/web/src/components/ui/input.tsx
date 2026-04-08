import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "#/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
	({ className, error, type = "text", ...props }, ref) => {
		return (
			<input
				ref={ref}
				type={type}
				className={cn(
					"flex h-10 w-full rounded-lg border bg-[var(--surface-strong)] px-3 py-2 text-sm text-[var(--sea-ink)] placeholder:text-[var(--sea-ink-soft)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--lagoon)] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all",
					error && "border-red-500 focus:ring-red-500",
					!error && "border-[var(--line)] focus:border-[var(--lagoon)]",
					className,
				)}
				{...props}
			/>
		);
	},
);

Input.displayName = "Input";
