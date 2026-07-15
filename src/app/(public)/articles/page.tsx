// app/(public)/articles/page.tsx
import { getAllArticles, type ArticlePreview } from "@/lib/articles";
import { ArticleCard } from "@/components/article/ArticleCard";
import { buildMetadata } from "@/lib/metadata";
import Link from "next/link";

export default async function ArticlesPage() {
  let listArticles: ArticlePreview[] = [];

  try {
    listArticles = await getAllArticles();
  } catch (error) {
    console.warn(
      "Failed to fetch articles. Database may not be available during build.",
      error,
    );
  }

  return (
    <main
      className="px-4 md:px-10 py-8 md:py-12 editorial"
      aria-labelledby="articles-heading"
    >
      <header className="page-container mb-12 md:mb-16">
        <h1
          id="articles-heading"
          className="text-4xl md:text-5xl font-bold tracking-tight text-text-primary"
        >
          Knotic Articles
        </h1>
        <p className="mt-2 text-text-secondary">
          Articles on structured thinking, knowledge, and building Knotic.
        </p>
        <p className="mt-2 text-sm text-text-secondary">
          {listArticles.length} article{listArticles.length !== 1 ? "s" : ""}
        </p>
      </header>

      <section aria-label="Article list" className="page-container">
        {listArticles.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border-default bg-bg-surface p-8 text-center">
            <h2 className="text-lg font-semibold text-text-primary">
              No articles yet
            </h2>
            <p className="mt-2 text-sm text-text-secondary">
              When new posts are published, they&apos;ll appear here in the
              Knotic articles page.
            </p>
            <div className="mt-6">
              <Link
                href="/write"
                className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base"
              >
                Write the first article
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {listArticles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export const metadata = buildMetadata(
  "Articles",
  "Explore articles from Knotic on structured thinking, writing, knowledge management, and modern content architecture.",
);
