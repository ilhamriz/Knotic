// app/(admin)/dashboard/DashboardClient.tsx
"use client";

import { useState } from "react";
import { toast } from "sonner";
import type { ArticlePreview } from "@/lib/articles";
import Buttons from "@/components/shared/button";
import ConfirmDialog from "@/components/shared/confirm-dialog";
import { cn } from "@/lib/utils";
import { EyeOpenIcon, PencilIcon, TrashIcon } from "@/components/shared/icons";

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

      {/* STATS SUMMARY */}
      {articles.length > 0 &&
        (() => {
          const publishedCount = articles.filter(
            (a) => a.status !== "draft",
          ).length;
          const draftCount = articles.filter(
            (a) => a.status === "draft",
          ).length;

          return (
            <div className="mb-8 flex flex-wrap gap-4">
              <StatSummary label="Total articles" value={articles.length} />
              <StatSummary
                label="Published"
                value={publishedCount}
                variant="published"
              />
              <StatSummary label="Drafts" value={draftCount} variant="draft" />
            </div>
          );
        })()}

      {/* ARTICLE LIST */}
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
              <div className="flex flex-col gap-x-10 gap-y-6 md:flex-row md:items-center md:justify-between">
                {/* CONTENT */}
                <div>
                  <span
                    className={cn(
                      "w-fit rounded-full bg-bg-elevated border px-2.5 py-0.5 text-xs font-medium",
                      article.status === "draft"
                        ? "text-accent border-accent/30"
                        : "text-primary border-primary/30",
                    )}
                  >
                    {article.status === "draft" ? "Draft" : "Published"}
                  </span>
                  <h2 className="pt-2 text-xl font-semibold text-text-primary">
                    {article.title}
                  </h2>
                  <p className="text-sm text-text-secondary mt-1 line-clamp-2">
                    {article.excerpt}
                  </p>
                </div>

                {/* BUTTONS */}
                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={`/articles/${article.slug}`}
                    title="View article"
                    aria-label="View article"
                    className="flex items-center justify-center w-10 h-10 rounded-full border border-border-default text-text-primary hover:border-border-strong transition-colors"
                  >
                    <EyeOpenIcon size="16" />
                  </a>
                  <a
                    href={`/edit/${article.slug}`}
                    title="Edit article"
                    aria-label="Edit article"
                    className="flex items-center justify-center w-10 h-10 rounded-full border border-border-default text-text-primary hover:border-border-strong transition-colors"
                  >
                    <PencilIcon size="16" />
                  </a>

                  {/* DIVIDER */}
                  <span
                    className="h-6 w-px bg-border-default mx-1"
                    aria-hidden="true"
                  />

                  <Buttons
                    intent="secondary"
                    onClick={() => handleToggleStatus(article)}
                    disabled={statusLoadingSlug === article.slug}
                    className="min-w-auto w-[110px] md:h-10"
                  >
                    {statusLoadingSlug === article.slug
                      ? "Saving..."
                      : article.status === "draft"
                        ? "Publish"
                        : "Unpublish"}
                  </Buttons>
                  <button
                    type="button"
                    onClick={() => setConfirmDeleteSlug(article.slug)}
                    disabled={deleteLoadingSlug === article.slug}
                    aria-label="Delete article"
                    title="Delete article"
                    className="flex items-center justify-center w-10 h-10 rounded-full border border-danger/40 text-danger hover:bg-danger/10 hover:border-danger disabled:opacity-50 transition-colors cursor-pointer"
                  >
                    <TrashIcon size="16" />
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

const StatSummary = ({
  label,
  value,
  variant = "default",
}: {
  label: string;
  value: string | number;
  variant?: "default" | "published" | "draft";
}) => {
  const border = {
    published: "border-primary/30",
    draft: "border-accent/30",
    default: "border-border-default",
  };
  const text = {
    published: "text-primary",
    draft: "text-accent",
    default: "text-text-primary",
  };
  return (
    <div
      className={cn(
        "basis-[120px] rounded-xl border bg-bg-surface px-5 py-3",
        border[variant],
      )}
    >
      <p className={cn("text-2xl font-semibold", text[variant])}>{value}</p>
      <p className="text-xs text-text-secondary mt-0.5">{label}</p>
    </div>
  );
};
