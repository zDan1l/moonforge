/**
 * Code Preview Panel Component
 *
 * Middle panel for displaying file contents with syntax highlighting.
 * Features line numbers, copy to clipboard, and language detection.
 */

import { Check, Copy, File } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useWorkspace } from "./WorkspaceContext";

// Simple language detection based on file extension
function detectLanguage(filePath: string): string {
	const ext = filePath.split(".").pop()?.toLowerCase();
	const langMap: Record<string, string> = {
		js: "javascript",
		jsx: "javascript",
		ts: "typescript",
		tsx: "typescript",
		py: "python",
		rb: "ruby",
		go: "go",
		rs: "rust",
		java: "java",
		cpp: "cpp",
		c: "c",
		cs: "csharp",
		php: "php",
		html: "html",
		css: "css",
		scss: "scss",
		sass: "sass",
		less: "less",
		json: "json",
		xml: "xml",
		yaml: "yaml",
		yml: "yaml",
		toml: "toml",
		md: "markdown",
		sql: "sql",
		sh: "shell",
		bash: "shell",
		zsh: "shell",
		fish: "shell",
		dockerfile: "dockerfile",
		docker: "dockerfile",
		makefile: "makefile",
	};
	return langMap[ext || ""] || "text";
}

// Simple syntax highlighting (basic implementation)
function highlightCode(code: string, language: string): string {
	// Escape HTML
	let escaped = code
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;");

	// Apply basic syntax highlighting based on language
	if (language === "javascript" || language === "typescript") {
		// Comments
		escaped = escaped.replace(
			/(\/\/.*$)/gm,
			'<span class="text-gray-500">$1</span>',
		);
		// Strings
		escaped = escaped.replace(
			/(["'`])(?:(?!\1)[^\\]|\\.)*\1/g,
			'<span class="text-green-600">$&</span>',
		);
		// Keywords
		const keywords = [
			"const",
			"let",
			"var",
			"function",
			"return",
			"if",
			"else",
			"for",
			"while",
			"class",
			"import",
			"export",
			"default",
			"from",
			"async",
			"await",
			"try",
			"catch",
			"throw",
			"new",
			"this",
			"interface",
			"type",
			"enum",
		];
		const keywordPattern = new RegExp(`\\b(${keywords.join("|")})\\b`, "g");
		escaped = escaped.replace(
			keywordPattern,
			'<span class="text-purple-600 font-semibold">$1</span>',
		);
	} else if (language === "json") {
		// Keys
		escaped = escaped.replace(
			/"([^"]+)":/g,
			'<span class="text-blue-600">"$1"</span>:',
		);
		// String values
		escaped = escaped.replace(
			/:\s*"([^"]*)"/g,
			': <span class="text-green-600">"$1"</span>',
		);
		// Numbers and booleans
		escaped = escaped.replace(
			/:\s*(\d+|true|false|null)/g,
			': <span class="text-orange-600">$1</span>',
		);
	}

	return escaped;
}

export function CodePreviewPanel() {
	const { selectedFile } = useWorkspace();
	const [copied, setCopied] = useState(false);
	const [language, setLanguage] = useState<string>("text");
	const [highlightedCode, setHighlightedCode] = useState<string>("");
	const preRef = useRef<HTMLPreElement>(null);

	// Detect language and highlight code when file changes
	useEffect(() => {
		if (selectedFile) {
			const lang = detectLanguage(selectedFile.path);
			setLanguage(lang);
			setHighlightedCode(highlightCode(selectedFile.content, lang));
		} else {
			setLanguage("text");
			setHighlightedCode("");
		}
	}, [selectedFile]);

	const handleCopy = async () => {
		if (!selectedFile) return;

		try {
			await navigator.clipboard.writeText(selectedFile.content);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (error) {
			console.error("Failed to copy:", error);
		}
	};

	const lines = selectedFile?.content.split("\n") || [];

	return (
		<main className="workspace-panel flex flex-1 flex-col overflow-hidden bg-[var(--sand)]">
			{/* Header */}
			<div className="flex items-center justify-between border-b border-[var(--line)] bg-[var(--surface)] px-4 py-2">
				<div className="flex items-center gap-2">
					<span className="text-sm font-medium text-[var(--sea-ink)]">
						Code Preview
					</span>
					{selectedFile && (
						<>
							<span className="text-[var(--line)]">|</span>
							<span className="text-xs text-[var(--sea-ink-soft)]">
								{selectedFile.path}
							</span>
						</>
					)}
				</div>
				{selectedFile && (
					<div className="flex items-center gap-2">
						<span className="rounded border border-[var(--border-color)] bg-[var(--surface)] px-2 py-0.5 text-xs text-[var(--sea-ink-soft)]">
							{language}
						</span>
						<button
							type="button"
							onClick={handleCopy}
							className="flex items-center gap-1 rounded-md border border-[var(--border-color)] bg-transparent px-2 py-1 text-xs text-[var(--sea-ink)] transition hover:bg-[var(--surface)] hover:text-[var(--lagoon)]"
							title="Copy to clipboard"
						>
							{copied ? (
								<>
									<Check className="h-3.5 w-3.5 text-green-600" />
									Copied!
								</>
							) : (
								<>
									<Copy className="h-3.5 w-3.5" />
									Copy
								</>
							)}
						</button>
					</div>
				)}
			</div>

			{/* Code Content */}
			<div className="flex flex-1 items-center justify-center overflow-auto">
				{selectedFile ? (
					<div className="flex h-full w-full">
						{/* Line Numbers */}
						<div className="sticky left-0 flex select-none flex-col items-end border-r border-[var(--line)] bg-[var(--surface)] px-3 py-4 text-xs font-mono text-[var(--sea-ink-soft)]">
							{lines.map((line, index) => {
								const lineNumber = index + 1;
								return (
									<div
										key={`${lineNumber}-${line.slice(0, 20)}`}
										className="leading-6"
									>
										{lineNumber}
									</div>
								);
							})}
						</div>

						{/* Code */}
						<div className="flex-1 overflow-auto">
							<pre
								ref={preRef}
								className="h-full bg-[var(--sand)] p-4 text-sm font-mono leading-6 text-[var(--sea-ink)]"
							>
								{/* biome-ignore lint/security/noDangerouslySetInnerHtml: Code content from backend files, not user input */}
								<code dangerouslySetInnerHTML={{ __html: highlightedCode }} />
							</pre>
						</div>
					</div>
				) : (
					<div className="text-center">
						<File className="mx-auto mb-3 h-12 w-12 text-[var(--sea-ink-soft)]" />
						<p className="text-sm text-[var(--sea-ink-soft)]">
							Select a file to preview its contents
						</p>
					</div>
				)}
			</div>
		</main>
	);
}
