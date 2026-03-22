import { getAllArticles } from "@/lib/articles";
import { ArticleCard } from "@/components/article/ArticleCard";
import type { Metadata } from "next";

export default function ArticlesPage() {
  const listArticles = getAllArticles();

  return (
    <main className="px-4 md:px-10 py-10" aria-labelledby="articles-heading">
      <header className="max-w-5xl mx-auto mb-8">
        <h1
          id="articles-heading"
          className="text-3xl md:text-4xl font-bold tracking-tight text-gray-50"
        >
          Knotic Articles
        </h1>
        <p className="mt-2 text-gray-400">
          Articles on structured thinking, knowledge, and building Knotic.
        </p>
      </header>

      <section aria-label="Article list" className="max-w-5xl mx-auto">
        {listArticles.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-800 bg-gray-900/40 p-8 text-center">
            <h2 className="text-lg font-semibold text-gray-100">
              No articles yet
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              When new posts are published, they&apos;ll appear here in the
              Knotic articles page.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {listArticles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export const metadata: Metadata = {
  title: "Knotic Articles",
  description:
    "Explore articles from Knotic on structured thinking, writing, knowledge management, and modern content architecture.",
};

