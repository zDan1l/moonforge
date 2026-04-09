/**
 * Modal Component
 *
 * A reusable modal dialog component with backdrop, animations, and focus trap.
 */

import { X } from "lucide-react";
import { useEffect, useRef } from "react";

export interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	title?: string;
	children: React.ReactNode;
	footer?: React.ReactNode;
	size?: "sm" | "md" | "lg" | "xl";
}

const sizeClasses = {
	sm: "max-w-md",
	md: "max-w-lg",
	lg: "max-w-2xl",
	xl: "max-w-4xl",
};

export function Modal({
	isOpen,
	onClose,
	title,
	children,
	footer,
	size = "lg",
}: ModalProps) {
	const modalRef = useRef<HTMLDivElement>(null);
	const previousActiveElement = useRef<Element | null>(null);

	// Focus trap
	useEffect(() => {
		if (!isOpen) return;

		// Store previously focused element
		previousActiveElement.current = document.activeElement;

		// Focus modal
		modalRef.current?.focus();

		// Handle Escape key
		const handleEscape = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				onClose();
			}
		};

		// Prevent body scroll
		document.body.style.overflow = "hidden";

		document.addEventListener("keydown", handleEscape);

		return () => {
			document.removeEventListener("keydown", handleEscape);
			document.body.style.overflow = "";

			// Restore focus when closing
			if (previousActiveElement.current instanceof HTMLElement) {
				previousActiveElement.current.focus();
			}
		};
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	return (
		<>
			{/* Backdrop */}
			<div
				className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
				aria-hidden="true"
				onClick={onClose}
			/>

			{/* Modal */}
			<div
				ref={modalRef}
				role="dialog"
				aria-modal="true"
				aria-labelledby={title ? "modal-title" : undefined}
				className={`${sizeClasses[size]} w-full animate-in zoom-in-95 slide-in-from-bottom-4 duration-200`}
			>
				<div className="island-shell rounded-2xl shadow-xl">
					{/* Header */}
					{title && (
						<div className="flex items-center justify-between border-b border-[var(--border-color)] px-6 py-4">
							<h2
								id="modal-title"
								className="text-lg font-semibold text-[var(--sea-ink)]"
							>
								{title}
							</h2>
							<button
								type="button"
								onClick={onClose}
								className="rounded-lg p-1 text-[var(--sea-ink-soft)] transition hover:bg-[var(--hover-bg)] hover:text-[var(--sea-ink)]"
								aria-label="Close modal"
							>
								<X className="h-5 w-5" />
							</button>
						</div>
					)}

					{/* Content */}
					<div className="px-6 py-4">{children}</div>

					{/* Footer */}
					{footer && (
						<div className="flex items-center justify-end border-t border-[var(--border-color)] px-6 py-4">
							{footer}
						</div>
					)}
				</div>
			</div>
		</>
	);
}
