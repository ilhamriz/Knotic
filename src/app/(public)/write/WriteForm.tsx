// app/(public)/write/WriteForm.tsx
"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import type { Session } from "next-auth";
import AiAssistant from "@/components/ai/AiAssistant";

interface WriteFormProps {
  session: Session;
}

export default function WriteForm({ session }: WriteFormProps) {
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [tags, setTags] = useState("");
  const [content, setContent] = useState("");
  const [notification, setNotification] = useState<string | null>(null);
  const router = useRouter();

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNotification("Saving...");
    try {
      const response = await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          excerpt,
          coverImage,
          tags,
          content,
          status: "draft",
        }),
      });
      if (!response.ok) {
        const data = await response.json();
        setNotification(`Error: ${data.error || "Unable to save article"}`);
        return;
      }
      setNotification(
        "Draft saved successfully. Publish it from your dashboard.",
      );
      setTitle("");
      setExcerpt("");
      setCoverImage("");
      setTags("");
      setContent("");
      setTimeout(() => {
        router.push("/dashboard");
      }, 800);
    } catch (error) {
      console.error(error);
      setNotification("Error: Unable to create article");
    }
  };

  return (
    <main className="px-4 md:px-10 py-10 max-w-6xl mx-auto">
      <div className="mb-8 rounded-2xl border border-border-default bg-bg-surface p-6">
        <p className="text-sm text-text-secondary mb-2">Logged in as</p>
        <p className="text-lg font-semibold text-text-primary">
          {session.user.name ?? session.user.email}
        </p>
        <p className="text-sm text-text-muted">
          You can create a new article now.
        </p>
      </div>

      <h1 className="text-3xl font-bold text-text-primary mb-6">
        Write a new article
      </h1>
      <form onSubmit={onSubmit} className="space-y-5">
        <div>
          <label
            className="block text-sm font-medium text-text-primary"
            htmlFor="title"
          >
            Title
          </label>
          <input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mt-1 block w-full rounded-lg border border-border-default bg-bg-surface px-3 py-2 text-text-primary"
          />
        </div>

        <div>
          <label
            className="block text-sm font-medium text-text-primary"
            htmlFor="excerpt"
          >
            Excerpt
          </label>
          <textarea
            id="excerpt"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            required
            rows={3}
            className="mt-1 block w-full rounded-lg border border-border-default bg-bg-surface px-3 py-2 text-text-primary"
          />
        </div>

        <div>
          <label
            className="block text-sm font-medium text-text-primary"
            htmlFor="coverImage"
          >
            Cover Image URL
          </label>
          <input
            id="coverImage"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            required
            className="mt-1 block w-full rounded-lg border border-border-default bg-bg-surface px-3 py-2 text-text-primary"
            placeholder="https://images.unsplash.com/photo-..."
          />
          <p className="mt-1 text-xs text-text-muted">
            Paste a public image URL
          </p>
        </div>

        <div>
          <label
            className="block text-sm font-medium text-text-primary"
            htmlFor="tags"
          >
            Tags (comma-separated)
          </label>
          <input
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-border-default bg-bg-surface px-3 py-2 text-text-primary"
          />
        </div>

        <div>
          <label
            className="block text-sm font-medium text-text-primary"
            htmlFor="content"
          >
            Content (Markdown)
          </label>
          <div className="mt-1 grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-[400px]">
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={15}
              className="block w-full rounded-lg border border-border-default bg-bg-surface px-3 py-2 text-text-primary font-mono resize-none"
              placeholder="Write your markdown here..."
            />
            <div className="block w-full rounded-lg border border-border-default bg-bg-surface px-4 py-2 text-text-primary overflow-auto">
              <div
                className="prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="rounded-lg bg-primary px-5 py-2.5 text-white font-semibold hover:bg-primary-hover"
          >
            Submit article
          </button>
          {notification && (
            <p className="text-sm text-text-secondary">{notification}</p>
          )}
        </div>
      </form>

      <AiAssistant
        content={content}
        onApplyContent={(val) => setContent(val)}
        onApplyTitle={(val) => setTitle(val)}
        onApplyExcerpt={(val) => setExcerpt(val)}
      />
    </main>
  );
}

function renderMarkdown(text: string) {
  return text
    .replace(
      /^### (.*$)/gim,
      '<h3 class="text-lg font-semibold text-text-primary mt-4 mb-2">$1</h3>',
    )
    .replace(
      /^## (.*$)/gim,
      '<h2 class="text-xl font-semibold text-text-primary mt-6 mb-3">$1</h2>',
    )
    .replace(
      /^# (.*$)/gim,
      '<h1 class="text-2xl font-bold text-text-primary mt-8 mb-4">$1</h1>',
    )
    .replace(/\*\*(.*)\*\*/gim, '<strong class="font-semibold">$1</strong>')
    .replace(/\*(.*)\*/gim, "<em>$1</em>")
    .replace(
      /`([^`]+)`/gim,
      '<code class="bg-bg-elevated px-1 py-0.5 rounded text-sm font-mono">$1</code>',
    )
    .replace(
      /!\[([^\]]*)\]\(([^)]+)\)/gim,
      '<img src="$2" alt="$1" class="max-w-full h-auto rounded-lg mt-4 mb-4" />',
    )
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/gim,
      '<a href="$2" class="text-primary hover:text-primary-hover underline">$1</a>',
    )
    .replace(/\n\n/gim, '</p><p class="mb-4">')
    .replace(/\n/gim, "<br/>")
    .replace(/^/, '<p class="mb-4">')
    .replace(/$/, "</p>");
}
