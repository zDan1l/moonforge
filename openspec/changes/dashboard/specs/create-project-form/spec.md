# Create Project Form

**Status:** Planned
**Type:** Feature
**Module:** dashboard

---

## Purpose

Form component for creating a new project. Collects project name and description, validates input, and handles submission to the API.

**PRD Reference:** Section 3.1 (Langkah 1 — Buat Project Baru).

---

## Files

| File | Purpose |
|------|---------|
| `apps/web/src/components/dashboard/CreateProjectForm.tsx` | Create project form component |

---

## CreateProjectForm.tsx

```tsx
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { api } from "@/lib/api";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { z } from "zod";

const CreateProjectSchema = z.object({
  name: z.string().min(1, "Project name is required").max(255, "Name too long"),
  description: z.string().min(1, "Description is required"),
});

type FormData = z.infer<typeof CreateProjectSchema>;

interface CreateProjectFormProps {
  onSuccess?: (project: { id: string; name: string }) => void;
}

export function CreateProjectForm({ onSuccess }: CreateProjectFormProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleChange = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const result = CreateProjectSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof FormData, string>> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof FormData;
        fieldErrors[field] = issue.message;
      }
      setErrors(fieldErrors);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const response = await api.projects.$post({
        json: {
          name: formData.name,
          description: formData.description,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to create project. Please try again.");
      }

      const result = await response.json();
      const project = result.data;

      onSuccess?.(project);

      // Navigate to workspace
      navigate({ to: `/projects/${project.id}` });
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form id="create-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Name Field */}
      <Input
        label="Project Name"
        placeholder="My SaaS App"
        value={formData.name}
        onChange={handleChange("name")}
        error={errors.name}
        autoFocus
        required
      />

      {/* Description Field */}
      <Textarea
        label="Description"
        placeholder="SaaS B2B with users, subscriptions, and dashboard analytics"
        value={formData.description}
        onChange={handleChange("description")}
        error={errors.description}
        hint="Describe your project in natural language"
        rows={4}
        required
      />

      {/* Submit Error */}
      {submitError && (
        <p className="text-sm text-red-600" role="alert">
          {submitError}
        </p>
      )}

      {/* Submit Button (hidden, triggered by Modal footer) */}
      <Button type="submit" variant="primary" loading={isSubmitting} className="hidden">
        Create Project
      </Button>
    </form>
  );
}
```

---

## Validation Rules

| Field | Rule | Error Message |
|-------|------|---------------|
| `name` | Required, 1-255 chars | "Project name is required" / "Name too long" |
| `description` | Required, min 1 char | "Description is required" |

Validation is done client-side with Zod (mirrors server-side validation in `projects.schema.ts`).

---

## States

| State | Visual | Behavior |
|-------|--------|----------|
| Idle | Empty fields, no errors | Form ready for input |
| Invalid | Field error shown below input | User corrects error |
| Submitting | Submit button shows spinner | Form inputs disabled |
| Success | Modal closes, redirect to workspace | — |
| Error | Error message shown above button | User can retry |

---

## API Call

```typescript
// POST /api/projects
const response = await api.projects.$post({
  json: {
    name: "My SaaS App",
    description: "SaaS B2B with users...",
  },
});

// Response: { success: true, data: { id, name, ...project } }
```

---

## Usage with Modal

```tsx
function ProjectsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Modal
      open={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      title="Create New Project"
      footer={
        <>
          <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
            Cancel
          </Button>
          <Button type="submit" form="create-form" loading={isSubmitting}>
            Create Project
          </Button>
        </>
      }
    >
      <CreateProjectForm onSuccess={() => setIsModalOpen(false)} />
    </Modal>
  );
}
```

**Note:** The `Button type="submit" form="create-form"` pattern allows the modal footer to trigger the form submit while keeping the form content separate from the action buttons.
