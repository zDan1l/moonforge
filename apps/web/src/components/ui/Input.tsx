import { forwardRef, type InputHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	label?: string;
	error?: string;
	hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
	({ label, error, hint, className = "", id, ...props }, ref) => {
		const inputId = id || `input-${Math.random().toString(36).slice(2)}`;

		return (
			<div className="flex flex-col gap-1">
				{label && (
					<label
						htmlFor={inputId}
						className="text-sm font-medium text-[var(--sea-ink)]"
					>
						{label}
					</label>
				)}
				<input
					ref={ref}
					id={inputId}
					className={`rounded-lg border bg-[var(--surface)] px-3.5 py-2 text-sm text-[var(--sea-ink)] placeholder-[var(--sea-ink-soft)] transition-all duration-150 focus:border-[var(--lagoon-deep)] focus:outline-none focus:ring-2 focus:ring-[var(--lagoon)]/20 disabled:cursor-not-allowed disabled:opacity-50 ${
						error
							? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
							: "border-[var(--line)]"
					} ${className}`}
					{...props}
				/>
				{error && <span className="text-xs text-red-500">{error}</span>}
				{hint && !error && (
					<span className="text-xs text-[var(--sea-ink-soft)]">{hint}</span>
				)}
			</div>
		);
	},
);

Input.displayName = "Input";
