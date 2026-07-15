// app/(public)/tags/[tag]/page.tsx
import { getArticlesByTag } from "@/lib/articles";
import { ArticleCard } from "@/components/article/ArticleCard";
import { buildMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import Link from "next/link";

type Props = { params: Promise<{ tag: string }> };

export default async function TagPage({ params }: Props) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  const articles = await getArticlesByTag(decodedTag);

  return (
    <main
      className="px-4 md:px-10 py-10 editorial"
      aria-labelledby="tag-heading"
    >
      <header className="page-container mb-12 md:mb-16">
        <div className="flex items-center gap-2 mb-2">
          <Link
            href="/articles"
            className="text-sm text-text-secondary hover:text-text-primary"
          >
            Articles
          </Link>
          <span className="text-sm text-text-muted">/</span>
          <span className="text-sm text-text-secondary">Tag</span>
        </div>
        <h1
          id="tag-heading"
          className="text-4xl md:text-5xl font-bold tracking-tight text-text-primary"
        >
          Articles tagged &ldquo;{decodedTag}&rdquo;
        </h1>
        <p className="mt-2 text-text-secondary">
          {articles.length} article{articles.length !== 1 ? "s" : ""} found
        </p>
      </header>

      <section aria-label="Article list" className="page-container">
        {articles.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border-default bg-bg-surface p-8 text-center">
            <h2 className="text-lg font-semibold text-text-primary">
              No articles found
            </h2>
            <p className="mt-2 text-sm text-text-secondary">
              No articles have been tagged with &ldquo;{decodedTag}&rdquo; yet.
            </p>
            <div className="mt-6">
              <Link
                href="/articles"
                className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base"
              >
                View all articles
              </Link>
            </div>
          </div>
        ) : (
          <div className="article-grid">
            {articles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);

  return buildMetadata(
    `Articles tagged "${decodedTag}"`,
    `Browse articles tagged with "${decodedTag}" on Knotic.`,
  );
}
