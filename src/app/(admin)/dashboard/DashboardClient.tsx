// app/(admin)/dashboard/DashboardClient.tsx
"use client";

import { useState } from "react";
import { toast } from "sonner";
import type { ArticlePreview } from "@/lib/articles";
import Buttons from "@/components/shared/button";
import ConfirmDialog from "@/components/shared/confirm-dialog";

interface DashboardClientProps {
  articles: ArticlePreview[];
}

export default function DashboardClient({
  articles: initialArticles,
}: DashboardClientProps) {
  const [articles, setArticles] = useState(initialArticles);
  const [confirmDeleteSlug, setConfirmDeleteSlug] = useState<string | null>(
    null,
  );
  const [deleteLoadingSlug, setDeleteLoadingSlug] = useState<string | null>(
    null,
  );
  const [statusLoadingSlug, setStatusLoadingSlug] = useState<string | null>(
    null,
  );

  const handleDelete = async (slug: string) => {
    setDeleteLoadingSlug(slug);

    try {
      const response = await fetch(
        `/api/articles/${encodeURIComponent(slug)}`,
        { method: "DELETE" },
      );

      if (!response.ok) {
        const data = await response.json();
        toast.error(data.error || "Unable to delete article");
        return;
      }

      setArticles((prev) => prev.filter((a) => a.slug !== slug));
      toast.success("Article deleted successfully.");
    } catch (error) {
      console.error(error);
      toast.error("Unable to delete article");
    } finally {
      setDeleteLoadingSlug(null);
    }
  };

  const handleToggleStatus = async (article: ArticlePreview) => {
    const newStatus = article.status === "draft" ? "published" : "draft";
    setStatusLoadingSlug(article.slug);

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
        toast.error(data.error || "Unable to update status");
        return;
      }

      setArticles((prev) =>
        prev.map((a) =>
          a.slug === article.slug ? { ...a, status: newStatus } : a,
        ),
      );
      toast.success(
        `"${article.title}" is now ${newStatus === "published" ? "published" : "saved as a draft"}.`,
      );
    } catch (error) {
      console.error(error);
      toast.error("Unable to update article status");
    } finally {
      setStatusLoadingSlug(null);
    }
  };

  return (
    <main className="page-container py-10">
      <header className="mb-10">
        <h1 className="text-4xl font-bold text-text-primary">Dashboard</h1>
        <p className="mt-2 text-text-secondary">
          Manage your articles, create, edit, and delete posts you created.
        </p>
      </header>

      {articles.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border-default bg-bg-surface p-10 text-center">
          <h2 className="text-xl font-semibold text-text-primary">
            No articles yet
          </h2>
          <p className="mt-2 text-text-secondary">
            You have not published any articles yet. Use the write page to add
            your first one.
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {articles.map((article) => (
            <div
              key={article.slug}
              className="rounded-2xl border border-border-default bg-bg-surface p-5"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-semibold text-text-primary">
                      {article.title}
                    </h2>
                    {article.status === "draft" ? (
                      <span className="rounded-full bg-bg-elevated border border-accent/30 px-2.5 py-0.5 text-xs font-medium text-accent">
                        Draft
                      </span>
                    ) : (
                      <span className="rounded-full bg-bg-elevated border border-primary/30 px-2.5 py-0.5 text-xs font-medium text-primary">
                        Published
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-text-secondary mt-1 line-clamp-2">
                    {article.excerpt}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Buttons
                    intent="secondary"
                    href={`/articles/${article.slug}`}
                    className="min-w-auto"
                  >
                    View
                  </Buttons>
                  <Buttons
                    intent="secondary"
                    href={`/edit/${article.slug}`}
                    className="min-w-auto"
                  >
                    Edit
                  </Buttons>
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(article)}
                    disabled={statusLoadingSlug === article.slug}
                    className="rounded-full border border-border-strong bg-bg-elevated px-4 py-2 text-sm font-semibold text-text-primary hover:bg-bg-surface hover:border-border-strong disabled:opacity-50"
                  >
                    {statusLoadingSlug === article.slug
                      ? "Saving..."
                      : article.status === "draft"
                        ? "Publish"
                        : "Unpublish"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDeleteSlug(article.slug)}
                    disabled={deleteLoadingSlug === article.slug}
                    className="rounded-full border border-danger/40 px-4 py-2 text-sm font-semibold text-danger hover:bg-danger/10 hover:border-danger disabled:opacity-50"
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

      <ConfirmDialog
        open={confirmDeleteSlug !== null}
        title="Delete this article?"
        description="This action cannot be undone. The article will be permanently removed."
        confirmLabel="Delete"
        variant="danger"
        onConfirm={() => {
          if (confirmDeleteSlug) handleDelete(confirmDeleteSlug);
          setConfirmDeleteSlug(null);
        }}
        onCancel={() => setConfirmDeleteSlug(null)}
      />
    </main>
  );
}
