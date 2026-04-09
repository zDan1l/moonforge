import { Loader2 } from "lucide-react";
import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: ButtonVariant;
	size?: ButtonSize;
	loading?: boolean;
	leftIcon?: ReactNode;
	rightIcon?: ReactNode;
	children: ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
	primary:
		"bg-[var(--lagoon)] text-white hover:bg-[var(--lagoon-deep)] disabled:bg-[var(--lagoon)]/50",
	secondary:
		"border border-[var(--line)] bg-[var(--surface)] text-[var(--sea-ink)] hover:border-[var(--lagoon-deep)] hover:bg-[var(--surface-strong)] disabled:opacity-50",
	ghost:
		"bg-transparent text-[var(--sea-ink-soft)] hover:bg-[var(--surface)] hover:text-[var(--sea-ink)] disabled:opacity-50",
};

const sizeClasses: Record<ButtonSize, string> = {
	sm: "px-3 py-1.5 text-xs gap-1.5",
	md: "px-4 py-2 text-sm gap-2",
	lg: "px-5 py-2.5 text-base gap-2",
};

export function Button({
	variant = "primary",
	size = "md",
	loading = false,
	leftIcon,
	rightIcon,
	children,
	disabled,
	className = "",
	...props
}: ButtonProps) {
	return (
		<button
			type="button"
			disabled={disabled || loading}
			className={`inline-flex items-center justify-center rounded-full font-semibold transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--lagoon)] focus-visible:ring-offset-2 disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
			{...props}
		>
			{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : leftIcon}
			{children}
			{!loading && rightIcon}
		</button>
	);
}
