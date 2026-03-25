"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

function renderMarkdown(text: string) {
  // Simple markdown renderer - handles basic elements
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

export default function WritePage() {
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [tags, setTags] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("Anonymous");
  const [status, setStatus] = useState<string | null>(null);
  const router = useRouter();

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("Saving...");

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
          author,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setStatus(`Error: ${data.error || "Unable to save article"}`);
        return;
      }

      const { article } = await response.json();
      setStatus("Article created successfully 🎉");
      setTitle("");
      setExcerpt("");
      setCoverImage("");
      setTags("");
      setContent("");
      setAuthor("Anonymous");

      setTimeout(() => {
        router.push(`/articles/${article.slug}`);
      }, 800);
    } catch (error) {
      console.error(error);
      setStatus("Error: Unable to create article");
    }
  };

  return (
    <main className="px-4 md:px-10 py-10 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-50 mb-6">
        Write a new article
      </h1>
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
          />
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
            htmlFor="author"
          >
            Author
          </label>
          <input
            id="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
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
            Submit article
          </button>
          {status && <p className="text-sm text-gray-300">{status}</p>}
        </div>
      </form>
    </main>
  );
}
