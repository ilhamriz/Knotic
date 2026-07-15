// app/(public)/write/WriteForm.tsx
"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import AiAssistant from "@/components/ai/AiAssistant";
import MarkdownPreview from "@/components/editor/MarkdownPreview";

export default function WriteForm() {
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [tags, setTags] = useState("");
  const [content, setContent] = useState("");
  const router = useRouter();

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
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
        toast.error(data.error || "Unable to save article");
        return;
      }
      toast.success(
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
      toast.error("Unable to create article");
    }
  };

  return (
    <main className="page-container pt-10 pb-25">
      <h1 className="text-3xl font-bold text-text-primary mb-8">
        Write a new article
      </h1>

      <form onSubmit={onSubmit} className="space-y-8">
        {/* Article metadata card */}
        <div className="rounded-2xl border border-border-default bg-bg-surface p-6 space-y-5">
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
              placeholder="e.g. Why Structured Thinking Matters"
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
              placeholder="A short 1-2 sentence summary shown on article cards and previews"
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
              placeholder="e.g. writing, productivity, thinking"
            />
          </div>
        </div>

        {/* Content / split editor section */}
        <div>
          <h2 className="text-xl font-semibold text-text-primary mb-4">
            Write your article
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-[500px]">
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={20}
              className="block w-full rounded-xl border border-border-default bg-bg-surface px-3 py-3 text-text-primary font-mono resize-none min-h-[500px]"
              placeholder="Write your markdown here..."
            />
            <div className="block w-full rounded-xl border border-border-default bg-bg-surface px-4 py-3 text-text-primary overflow-auto min-h-[500px]">
              <MarkdownPreview content={content} />
            </div>
          </div>
        </div>

        {/* Submit footer */}
        <div className="border-t border-border-subtle pt-5 mt-2 flex flex-col sm:flex-row sm:items-center gap-3">
          <button
            type="submit"
            className="rounded-lg bg-primary px-5 py-2.5 text-white font-semibold hover:bg-primary-hover"
          >
            Submit article
          </button>
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
