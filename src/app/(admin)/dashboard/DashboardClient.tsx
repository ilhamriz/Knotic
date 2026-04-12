"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ArticlePreview } from "@/lib/articles";

interface DashboardClientProps {
  articles: ArticlePreview[];
}

export default function DashboardClient({
  articles: initialArticles,
}: DashboardClientProps) {
  const [articles, setArticles] = useState(initialArticles);
  const [loadingSlug, setLoadingSlug] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const router = useRouter();

  const handleDelete = async (slug: string) => {
    if (!confirm("Delete this article?")) return;
    setLoadingSlug(slug);
    setStatus(null);

    try {
      const response = await fetch(
        `/api/articles?slug=${encodeURIComponent(slug)}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        const data = await response.json();
        setStatus(`Error: ${data.error || "Unable to delete article"}`);
        return;
      }

      setArticles((prev) => prev.filter((article) => article.slug !== slug));
      setStatus("Article deleted successfully.");
    } catch (error) {
      console.error(error);
      setStatus("Error: Unable to delete article");
    } finally {
      setLoadingSlug(null);
    }
  };

  return (
    <main className="px-4 md:px-10 py-10 max-w-6xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-50">Dashboard</h1>
        <p className="mt-2 text-gray-400">
          Manage your articles and delete posts you created.
        </p>
      </header>

      {status && (
        <div className="mb-6 rounded-xl border border-blue-500/20 bg-blue-500/10 px-4 py-3 text-sm text-blue-100">
          {status}
        </div>
      )}

      {articles.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-800 bg-gray-900/40 p-10 text-center">
          <h2 className="text-xl font-semibold text-gray-100">
            No articles yet
          </h2>
          <p className="mt-2 text-gray-400">
            You have not published any articles yet. Use the write page to add
            your first one.
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {articles.map((article) => (
            <div
              key={article.slug}
              className="rounded-2xl border border-gray-800 bg-gray-900/80 p-5"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-50">
                    {article.title}
                  </h2>
                  <p className="text-sm text-gray-400 mt-1">
                    {article.excerpt}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => router.push(`/articles/${article.slug}`)}
                    className="rounded-full border border-gray-700 bg-gray-950 px-4 py-2 text-sm text-white hover:border-gray-500"
                  >
                    View
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(article.slug)}
                    disabled={loadingSlug === article.slug}
                    className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500 disabled:opacity-50"
                  >
                    {loadingSlug === article.slug ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
