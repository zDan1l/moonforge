import type { ReactNode } from "react";

export interface CardProps {
	children: ReactNode;
	className?: string;
	hoverable?: boolean;
	onClick?: () => void;
}

export interface CardHeaderProps {
	children: ReactNode;
	className?: string;
}

export interface CardBodyProps {
	children: ReactNode;
	className?: string;
}

export interface CardFooterProps {
	children: ReactNode;
	className?: string;
}

export interface CardSubComponents {
	Header: (props: CardHeaderProps) => JSX.Element;
	Body: (props: CardBodyProps) => JSX.Element;
	Footer: (props: CardFooterProps) => JSX.Element;
}

function CardHeader({ children, className = "" }: CardHeaderProps) {
	return (
		<div className={`border-b border-[var(--line)] px-5 py-3 ${className}`}>
			{children}
		</div>
	);
}

function CardBody({ children, className = "" }: CardBodyProps) {
	return <div className={`px-5 py-4 ${className}`}>{children}</div>;
}

function CardFooter({ children, className = "" }: CardFooterProps) {
	return (
		<div
			className={`border-t border-[var(--line)] bg-[var(--surface)] px-5 py-3 ${className}`}
		>
			{children}
		</div>
	);
}

export function Card({
	children,
	className = "",
	hoverable = false,
	onClick,
}: CardProps) {
	const baseClasses = `rounded-2xl border border-[var(--line)] bg-gradient-to-br from-[var(--surface-strong)] to-[var(--surface)] shadow-[0_1px_0_var(--inset-glint)_inset,0_22px_44px_rgba(30,90,72,0.1),0_6px_18px_rgba(23,58,64,0.08)] backdrop-blur-sm ${
		hoverable
			? "feature-card cursor-pointer transition-transform hover:-translate-y-0.5 hover:border-[var(--lagoon-deep)]/35"
			: ""
	} ${className}`;

	// Use button for clickable cards, div for static cards
	if (onClick) {
		return (
			<button
				type="button"
				className={`w-full text-left ${baseClasses}`}
				onClick={onClick}
			>
				{children}
			</button>
		);
	}

	return <div className={baseClasses}>{children}</div>;
}

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;
