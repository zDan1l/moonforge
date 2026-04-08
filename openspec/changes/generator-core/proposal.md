## Why

Template files sudah ada di `packages/generator/src/templates/` tapi logic generator masih kosong. `merge.ts` dan `zipper.ts` belum diimplementasikan. Tanpa Generator Core, MoonForge tidak bisa generate monorepo dari deskripsi user.

## What Changes

- **Setup packages/generator** - Initialize shared package with proper config
- **Implement template loader** - Functions untuk baca template files dari filesystem
- **Implement merge.ts** - Logic untuk merge template base + AI-generated content
- **Implement zipper.ts** - Create .zip file dari project files
- **Implement file structure builder** - Generate folder structure sesuai PRD
- **Mock AI content generator** - Hardcoded AI content dulu (sebelum AI Integration spec)

## Capabilities

### New Capabilities

- `template-storage`: Template files management and loading
- `file-structure-builder`: Generate Moon monorepo folder structure
- `template-merger`: Merge template base with AI-customized content
- `zip-creation`: Create downloadable .zip from project files
- `mock-ai-generator`: Mock AI content generator for MVP testing

### Modified Capabilities

None - ini adalah feature baru.

## Impact

**Affected Code:**
- `packages/generator/` - New shared package initialization
- `packages/generator/src/merge.ts` - Implement template merge logic
- `packages/generator/src/zipper.ts` - Implement zip creation
- `packages/generator/src/template-loader.ts` - New file for template loading
- `packages/generator/src/builder.ts` - New file for structure builder
- `packages/generator/src/ai-generator.ts` - New file for mock AI content
- `packages/generator/src/index.ts` - Export all public functions

**New Structure:**
```
packages/generator/src/
├── templates/           # Already exists with template files
│   ├── backend/       # API template [T]
│   ├── frontend/      # Web template [T]
│   ├── root/          # Root files [T]
│   └── packages/      # Packages template [T]
├── merge.ts            # TODO: Implement
├── zipper.ts           # TODO: Implement
├── template-loader.ts # New: Load template files
├── builder.ts          # New: Build file structure
├── ai-generator.ts     # New: Mock AI content
└── index.ts            # New: Public exports
```

**Integration Points:**
- **Projects Module** (teman kerjakan): Generator akan `saveProject()` dan `loadProject()`
- **AI Integration** (future): Generator akan call `generateContent()` untuk AI

**Dependencies:**
- `adm-zip` or similar for zip creation
- No additional dependencies expected (uses Node.js fs/path)
