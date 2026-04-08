import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "#/lib/utils";

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
	value: number;
	max?: number;
	size?: "sm" | "md" | "lg";
}

export const Progress = forwardRef<HTMLDivElement, ProgressProps>(
	({ className, value, max = 100, size = "md", ...props }, ref) => {
		const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

		const sizeClasses = {
			sm: "h-1",
			md: "h-2",
			lg: "h-3",
		};

		return (
			<div
				ref={ref}
				className={cn(
					"relative w-full overflow-hidden rounded-full bg-[var(--line)]",
					sizeClasses[size],
					className,
				)}
				{...props}
			>
				<div
					className="h-full bg-[var(--lagoon)] transition-all duration-300 ease-out"
					style={{ width: `${percentage}%` }}
				/>
			</div>
		);
	},
);

Progress.displayName = "Progress";
