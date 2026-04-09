import { Link } from "@tanstack/react-router";
import { Moon } from "lucide-react";

export function Header() {
	return (
		<header className="site-header border-b border-[var(--line)] bg-[var(--header-bg)] backdrop-blur-md">
			<div className="page-wrap flex h-14 items-center justify-between">
				{/* Logo */}
				<Link
					to="/"
					className="flex items-center gap-2 text-[var(--sea-ink)] no-underline transition hover:text-[var(--lagoon-deep)]"
				>
					<Moon className="h-6 w-6" />
					<span className="font-semibold">MoonForge</span>
				</Link>

				{/* Navigation */}
				<nav className="flex items-center gap-6">
					<Link
						to="/projects"
						className="nav-link text-sm font-medium"
						activeProps={{
							className: "is-active",
						}}
					>
						Projects
					</Link>
					<Link
						to="/about"
						className="nav-link text-sm font-medium"
						activeProps={{
							className: "is-active",
						}}
					>
						About
					</Link>
				</nav>
			</div>
		</header>
	);
}
