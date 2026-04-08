import type { Route } from "./+types/index";

export function meta({}: Route.MetaArgs) {
	return [
		{ title: "Admin Dashboard" },
		{
			name: "description",
			content: "MoonForge Admin Dashboard",
		},
	];
}

export default function Index({}: Route.ComponentProps) {
	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
				<div className="px-4 py-6 sm:px-0">
					<h1 className="text-3xl font-bold text-gray-900 mb-8">
						Admin Dashboard
					</h1>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{/* Stats Cards */}
						<div className="bg-white overflow-hidden shadow rounded-lg">
							<div className="p-5">
								<div className="flex items-center">
									<div className="flex-shrink-0">
										<div className="rounded-md bg-indigo-500 p-3">
											<svg
												className="h-6 w-6 text-white"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
												/>
											</svg>
										</div>
									</div>
									<div className="ml-5 w-0 flex-1">
										<dl>
											<dt className="text-sm font-medium text-gray-500 truncate">
												Total Projects
											</dt>
											<dd>
												<div className="text-lg font-medium text-gray-900">
													0
												</div>
											</dd>
										</dl>
									</div>
								</div>
							</div>
							<div className="bg-gray-50 px-5 py-3">
								<div className="text-sm">
									<a
										href="/admin/projects"
										className="font-medium text-indigo-700 hover:text-indigo-900"
									>
										View all projects
									</a>
								</div>
							</div>
						</div>

						{/* More stats... */}
						<div className="bg-white overflow-hidden shadow rounded-lg">
							<div className="p-5">
								<div className="flex items-center">
									<div className="flex-shrink-0">
										<div className="rounded-md bg-green-500 p-3">
											<svg
												className="h-6 w-6 text-white"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
												/>
											</svg>
										</div>
									</div>
									<div className="ml-5 w-0 flex-1">
										<dl>
											<dt className="text-sm font-medium text-gray-500 truncate">
												Active Sessions
											</dt>
											<dd>
												<div className="text-lg font-medium text-gray-900">
													0
												</div>
											</dd>
										</dl>
									</div>
								</div>
							</div>
							<div className="bg-gray-50 px-5 py-3">
								<div className="text-sm text-gray-500">
									No active sessions
								</div>
							</div>
						</div>

						<div className="bg-white overflow-hidden shadow rounded-lg">
							<div className="p-5">
								<div className="flex items-center">
									<div className="flex-shrink-0">
										<div className="rounded-md bg-yellow-500 p-3">
											<svg
												className="h-6 w-6 text-white"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
												/>
											</svg>
										</div>
									</div>
									<div className="ml-5 w-0 flex-1">
										<dl>
											<dt className="text-sm font-medium text-gray-500 truncate">
												Avg. Generation Time
											</dt>
											<dd>
												<div className="text-lg font-medium text-gray-900">
													--
												</div>
											</dd>
										</dl>
									</div>
								</div>
							</div>
							<div className="bg-gray-50 px-5 py-3">
								<div className="text-sm text-gray-500">
									No data yet
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
