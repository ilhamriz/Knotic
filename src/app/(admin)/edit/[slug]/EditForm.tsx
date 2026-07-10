"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import type { Session } from "next-auth";
import type { Article } from "@/lib/articles";
import AiAssistant from "@/components/ai/AiAssistant";

interface EditFormProps {
  article: Article;
  session: Session;
}

export default function EditForm({ article, session }: EditFormProps) {
  const [title, setTitle] = useState(article.title);
  const [excerpt, setExcerpt] = useState(article.excerpt);
  const [coverImage, setCoverImage] = useState(article.coverImage);
  const [tags, setTags] = useState(article.tags.join(", "));
  const [content, setContent] = useState(article.content);
  const [notification, setNotification] = useState<string | null>(null);
  const router = useRouter();

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNotification("Saving...");

    try {
      const response = await fetch(
        `/api/articles/${encodeURIComponent(article.slug)}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            excerpt,
            coverImage,
            tags,
            content,
          }),
        },
      );

      if (!response.ok) {
        const data = await response.json();
        setNotification(`Error: ${data.error || "Unable to save article"}`);
        return;
      }

      setNotification("Article updated successfully 🎉");

      setTimeout(() => {
        router.push(`/articles/${article.slug}`);
      }, 800);
    } catch (error) {
      console.error(error);
      setNotification("Error: Unable to update article");
    }
  };

  return (
    <main className="px-4 md:px-10 py-10 max-w-6xl mx-auto">
      <div className="mb-8 rounded-2xl border border-gray-800 bg-gray-900/70 p-6">
        <p className="text-sm text-gray-400 mb-2">Logged in as</p>
        <p className="text-lg font-semibold text-gray-50">
          {session.user.name ?? session.user.email}
        </p>
        <p className="text-sm text-gray-500">
          Editing{" "}
          <span className="text-gray-300 font-medium">{article.slug}</span> —
          slug is immutable and will not change.
        </p>
      </div>

      <h1 className="text-3xl font-bold text-gray-50 mb-6">Edit article</h1>

      <form onSubmit={onSubmit} className="space-y-5">
        <div>
          <label
            className="block text-sm font-medium text-gray-200"
            htmlFor="title"
          >
            Title
          </label>
          <input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mt-1 block w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-white"
          />
        </div>

        <div>
          <label
            className="block text-sm font-medium text-gray-200"
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
            className="mt-1 block w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-white"
          />
        </div>

        <div>
          <label
            className="block text-sm font-medium text-gray-200"
            htmlFor="coverImage"
          >
            Cover Image URL
          </label>
          <input
            id="coverImage"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            required
            className="mt-1 block w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-white"
            placeholder="https://images.unsplash.com/photo-..."
          />
          <p className="mt-1 text-xs text-gray-500">Paste a public image URL</p>
        </div>

        <div>
          <label
            className="block text-sm font-medium text-gray-200"
            htmlFor="tags"
          >
            Tags (comma-separated)
          </label>
          <input
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-white"
          />
        </div>

        <div>
          <label
            className="block text-sm font-medium text-gray-200"
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
              className="block w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-white font-mono resize-none"
              placeholder="Write your markdown here..."
            />
            <div className="block w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-2 text-white overflow-auto">
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
            className="rounded-lg bg-blue-500 px-5 py-2.5 text-white font-semibold hover:bg-blue-400"
          >
            Save changes
          </button>
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="rounded-lg border border-gray-700 px-5 py-2.5 text-gray-300 font-semibold hover:border-gray-500 hover:text-white"
          >
            Cancel
          </button>
          {notification && (
            <p
              className={`text-sm ${
                notification.startsWith("Error")
                  ? "text-red-400"
                  : notification === "Saving..."
                    ? "text-gray-400"
                    : "text-green-400"
              }`}
            >
              {notification}
            </p>
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
      '<h3 class="text-lg font-semibold text-gray-50 mt-4 mb-2">$1</h3>',
    )
    .replace(
      /^## (.*$)/gim,
      '<h2 class="text-xl font-semibold text-gray-50 mt-6 mb-3">$1</h2>',
    )
    .replace(
      /^# (.*$)/gim,
      '<h1 class="text-2xl font-bold text-gray-50 mt-8 mb-4">$1</h1>',
    )
    .replace(/\*\*(.*)\*\*/gim, '<strong class="font-semibold">$1</strong>')
    .replace(/\*(.*)\*/gim, "<em>$1</em>")
    .replace(
      /`([^`]+)`/gim,
      '<code class="bg-gray-800 px-1 py-0.5 rounded text-sm font-mono">$1</code>',
    )
    .replace(
      /!\[([^\]]*)\]\(([^)]+)\)/gim,
      '<img src="$2" alt="$1" class="max-w-full h-auto rounded-lg mt-4 mb-4" />',
    )
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/gim,
      '<a href="$2" class="text-blue-400 hover:text-blue-300 underline">$1</a>',
    )
    .replace(/\n\n/gim, '</p><p class="mb-4">')
    .replace(/\n/gim, "<br/>")
    .replace(/^/, '<p class="mb-4">')
    .replace(/$/, "</p>");
}
