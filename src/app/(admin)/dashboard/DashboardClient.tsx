// app/(admin)/dashboard/DashboardClient.tsx
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
  const [deleteLoadingSlug, setDeleteLoadingSlug] = useState<string | null>(
    null,
  );
  const [statusLoadingSlug, setStatusLoadingSlug] = useState<string | null>(
    null,
  );
  const [notification, setNotification] = useState<string | null>(null);
  const router = useRouter();

  const handleDelete = async (slug: string) => {
    if (!confirm("Delete this article?")) return;
    setDeleteLoadingSlug(slug);
    setNotification(null);

    try {
      const response = await fetch(
        `/api/articles/${encodeURIComponent(slug)}`,
        { method: "DELETE" },
      );

      if (!response.ok) {
        const data = await response.json();
        setNotification(`Error: ${data.error || "Unable to delete article"}`);
        return;
      }

      setArticles((prev) => prev.filter((a) => a.slug !== slug));
      setNotification("Article deleted successfully.");
    } catch (error) {
      console.error(error);
      setNotification("Error: Unable to delete article");
    } finally {
      setDeleteLoadingSlug(null);
    }
  };

  const handleToggleStatus = async (article: ArticlePreview) => {
    const newStatus = article.status === "draft" ? "published" : "draft";
    setStatusLoadingSlug(article.slug);
    setNotification(null);

    try {
      const response = await fetch(
        `/api/articles/${encodeURIComponent(article.slug)}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        },
      );

      if (!response.ok) {
        const data = await response.json();
        setNotification(`Error: ${data.error || "Unable to update status"}`);
        return;
      }

      setArticles((prev) =>
        prev.map((a) =>
          a.slug === article.slug ? { ...a, status: newStatus } : a,
        ),
      );
      setNotification(
        `"${article.title}" is now ${newStatus === "published" ? "published" : "saved as a draft"}.`,
      );
    } catch (error) {
      console.error(error);
      setNotification("Error: Unable to update article status");
    } finally {
      setStatusLoadingSlug(null);
    }
  };

  return (
    <main className="px-4 md:px-10 py-10 max-w-6xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-50">Dashboard</h1>
        <p className="mt-2 text-gray-400">
          Manage your articles, create, edit, and delete posts you created.
        </p>
      </header>

      {notification && (
        <div className="mb-6 rounded-xl border border-blue-500/20 bg-blue-500/10 px-4 py-3 text-sm text-blue-100">
          {notification}
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
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-semibold text-gray-50">
                      {article.title}
                    </h2>
                    {article.status === "draft" && (
                      <span className="rounded-full bg-gray-700 px-2.5 py-0.5 text-xs font-medium text-gray-300">
                        Draft
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-400 mt-1">
                    {article.excerpt}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => router.push(`/articles/${article.slug}`)}
                    className="rounded-full border border-gray-700 bg-gray-950 px-4 py-2 text-sm text-white hover:border-gray-500"
                  >
                    View
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push(`/edit/${article.slug}`)}
                    className="rounded-full border border-blue-500/50 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-300 hover:bg-blue-500/20 hover:border-blue-400"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(article)}
                    disabled={statusLoadingSlug === article.slug}
                    className="rounded-full border border-gray-600 bg-gray-800 px-4 py-2 text-sm font-semibold text-gray-200 hover:bg-gray-700 hover:border-gray-500 disabled:opacity-50"
                  >
                    {statusLoadingSlug === article.slug
                      ? "Saving..."
                      : article.status === "draft"
                        ? "Publish"
                        : "Unpublish"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(article.slug)}
                    disabled={deleteLoadingSlug === article.slug}
                    className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500 disabled:opacity-50"
                  >
                    {deleteLoadingSlug === article.slug
                      ? "Deleting..."
                      : "Delete"}
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
