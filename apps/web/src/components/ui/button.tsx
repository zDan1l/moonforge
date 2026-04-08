import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "#/lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: "primary" | "secondary" | "ghost" | "danger";
	size?: "sm" | "md" | "lg";
	isLoading?: boolean;
}

const buttonVariants = {
	primary:
		"bg-[var(--lagoon)] text-white hover:bg-[var(--lagoon-deep)] border-transparent",
	secondary:
		"bg-[var(--surface)] text-[var(--sea-ink)] hover:bg-[var(--surface-strong)] border-[var(--line)]",
	ghost:
		"bg-transparent text-[var(--sea-ink)] hover:bg-[var(--surface)] border-transparent",
	danger: "bg-red-500 text-white hover:bg-red-600 border-transparent",
};

const sizeVariants = {
	sm: "px-3 py-1.5 text-sm",
	md: "px-4 py-2 text-base",
	lg: "px-6 py-3 text-lg",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			className,
			variant = "primary",
			size = "md",
			isLoading = false,
			disabled,
			children,
			...props
		},
		ref,
	) => {
		return (
			<button
				ref={ref}
				disabled={disabled || isLoading}
				className={cn(
					"inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-180 border focus:outline-none focus:ring-2 focus:ring-[var(--lagoon)] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
					buttonVariants[variant],
					sizeVariants[size],
					className,
				)}
				{...props}
			>
				{isLoading && (
					<svg
						className="animate-spin h-4 w-4"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
					>
						<circle
							className="opacity-25"
							cx="12"
							cy="12"
							r="10"
							stroke="currentColor"
							strokeWidth="4"
						/>
						<path
							className="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
						/>
					</svg>
				)}
				{children}
			</button>
		);
	},
);

Button.displayName = "Button";
