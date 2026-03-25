"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

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
    <main className="px-4 md:px-10 py-10 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-50 mb-6">Write a new article</h1>
      <form onSubmit={onSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-200" htmlFor="title">
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
          <label className="block text-sm font-medium text-gray-200" htmlFor="excerpt">
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
          <label className="block text-sm font-medium text-gray-200" htmlFor="coverImage">
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
          <label className="block text-sm font-medium text-gray-200" htmlFor="tags">
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
          <label className="block text-sm font-medium text-gray-200" htmlFor="author">
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
          <label className="block text-sm font-medium text-gray-200" htmlFor="content">
            Content (Markdown)
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={12}
            className="mt-1 block w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-white font-mono"
          />
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
