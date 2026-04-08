import type { OpenSpec } from "#/lib/api-client";
import { Badge } from "./ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "./ui/card";

interface OpenSpecPreviewProps {
	openspec: OpenSpec;
}

export function OpenSpecPreview({ openspec }: OpenSpecPreviewProps) {
	return (
		<div className="space-y-6">
			{/* Project Overview */}
			<Card>
				<CardHeader>
					<CardTitle>{openspec.projectName}</CardTitle>
					<CardDescription>
						AI-generated workspace specification
					</CardDescription>
				</CardHeader>
			</Card>

			{/* Modules */}
			<Card>
				<CardHeader>
					<CardTitle>Modules ({openspec.modules.length})</CardTitle>
					<CardDescription>
						Backend API modules that will be generated
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-3">
						{openspec.modules.map((module) => (
							<div
								key={module.name}
								className="border border-[var(--line)] rounded-lg p-4 bg-[var(--surface)]"
							>
								<div className="flex items-center justify-between mb-2">
									<h4 className="font-semibold text-[var(--sea-ink)]">
										{module.name}
									</h4>
									<Badge variant="info">
										{module.endpoints.length} endpoints
									</Badge>
								</div>
								<p className="text-sm text-[var(--sea-ink-soft)] mb-2">
									{module.description}
								</p>
								<div className="flex flex-wrap gap-1">
									{module.endpoints.slice(0, 4).map((endpoint) => (
										<code
											key={endpoint}
											className="text-xs px-2 py-1 rounded bg-[var(--foam)] text-[var(--sea-ink-soft)]"
										>
											{endpoint}
										</code>
									))}
									{module.endpoints.length > 4 && (
										<span className="text-xs text-[var(--sea-ink-soft)]">
											+{module.endpoints.length - 4} more
										</span>
									)}
								</div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>

			{/* Database Models */}
			<Card>
				<CardHeader>
					<CardTitle>
						Database Models ({openspec.prismaModels.length})
					</CardTitle>
					<CardDescription>PostgreSQL schema with Prisma ORM</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-3">
						{openspec.prismaModels.map((model) => (
							<div
								key={model.name}
								className="border border-[var(--line)] rounded-lg p-4 bg-[var(--surface)]"
							>
								<div className="flex items-center justify-between mb-2">
									<h4 className="font-semibold text-[var(--sea-ink)]">
										{model.name}
									</h4>
									<Badge variant="default">{model.tableName}</Badge>
								</div>
								<div className="grid grid-cols-2 gap-2 text-sm">
									{model.fields.slice(0, 6).map((field) => (
										<div key={field.name} className="flex items-center gap-2">
											<span className="font-mono text-[var(--sea-ink-soft)]">
												{field.name}
											</span>
											<span className="text-[var(--lagoon-deep)]">
												{field.type}
											</span>
											{field.isUnique && (
												<span className="text-xs text-yellow-600">unique</span>
											)}
											{field.isOptional && (
												<span className="text-xs text-gray-500">?</span>
											)}
										</div>
									))}
								</div>
								{model.relations.length > 0 && (
									<div className="mt-3 pt-3 border-t border-[var(--line)]">
										<p className="text-xs text-[var(--sea-ink-soft)] mb-1">
											Relations:
										</p>
										{model.relations.map((rel) => (
											<div
												key={rel.fieldName}
												className="text-xs text-[var(--lagoon-deep)]"
											>
												{rel.fieldName} → {rel.modelName} ({rel.type})
											</div>
										))}
									</div>
								)}
							</div>
						))}
					</div>
				</CardContent>
			</Card>

			{/* Frontend Pages */}
			{openspec.frontendPages && openspec.frontendPages.length > 0 && (
				<Card>
					<CardHeader>
						<CardTitle>
							Frontend Pages ({openspec.frontendPages.length})
						</CardTitle>
						<CardDescription>TanStack Start routes for the UI</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="flex flex-wrap gap-2">
							{openspec.frontendPages.map((page) => (
								<Badge key={page.path} variant="secondary">
									{page.path}
								</Badge>
							))}
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
