## 1. Package Setup

- [ ] 1.1 Create `packages/generator/package.json` with proper configuration
- [ ] 1.2 Create `packages/generator/tsconfig.json` with proper paths
- [ ] 1.3 Create basic README for the generator package

## 2. Template Loader

- [ ] 2.1 Create `template-loader.ts` with file reading utilities
- [ ] 2.2 Implement `loadTemplateFiles()` to load all template files recursively
- [ ] 2.3 Implement `loadTemplateComponent(component)` to load specific template (backend/frontend/root)
- [ ] 2.4 Add template path mapping (template storage path → output path)
- [ ] 2.5 Implement template validation (check if files exist before loading)

## 3. File Structure Builder

- [ ] 3.1 Create `builder.ts` with structure building logic
- [ ] 3.2 Implement `buildProjectStructure(projectName)` to generate folder paths
- [ ] 3.3 Implement `ensureDirectory(path)` for recursive folder creation
- [ ] 3.4 Add path validation (prevent `..`, absolute paths)
- [ ] 3.5 Implement root files generation (package.json, pnpm-workspace.yaml, etc.)

## 4. Template Merger

- [ ] 4.1 Implement `merge.ts` with template + AI content merger
- [ ] 4.2 Create `mergeTemplateWithAI(templateFiles, aiFiles)` function
- [ ] 4.3 Implement AI priority (AI overrides template on same path)
-  [ ] 4.4 Add file source tracking for each merged file
-  [ ] 4.5 Handle binary files preservation (images, fonts, etc.)

## 5. Mock AI Content Generator

- [ ] 5.1 Create `ai-generator.ts` with mock content generation
- [ ] 5.2 Implement `generateMockPrismaSchema(description)` function
- [ ] 5.3 Implement `generateMockModules(modules)` function
- [ ] 5.4 Implement `generateMockTypes()` function
-  [ ] 5.5 Add realistic mock content (conventions, proper TypeScript)

## 6. Zip Creation

- [ ] 6.1 Implement `zipper.ts` with zip creation logic
- [ ] 6.2 Implement `createProjectZip(files)` function using adm-zip
- [ ] 6.3 Add folder structure preservation in zip
- [ ] 6.4 Include metadata file (project.json) in zip
- [ ] 6.5 Set proper Content-Type and Content-Disposition headers

## 7. Public API Exports

- [ ] 7.1 Create `index.ts` with public function exports
- [ ] 7.2 Export generator functions: `generateProject`, `createProjectZip`, `loadTemplateFiles`
- [ ] 7.3 Export types: `GeneratedFile`, `GenerateOptions`, `GeneratedProject`
- [ ] 7.4 Add JSDoc comments for all public functions

## 8. Testing

- [ ] 8.1 Test template loader loads all template files correctly
- [ ] 8.2 Test file structure builder creates correct folder hierarchy
- [ ] 8.3 Test merger prioritizes AI content over template
- [ ] 8.4 Test zip creation produces valid .zip file
- [ ] 8.5 Test mock AI generator produces realistic content
- [ ] 8.6 Test all error cases (missing template, invalid path, etc.)

## Out of Scope (Separate Specs)

- Integration with Projects Module (database save/load)
- Integration with AI Integration (Claude SDK client)
- Real-time generation streaming
- File diff generation (Refinement Flow spec)
- Template update mechanism
