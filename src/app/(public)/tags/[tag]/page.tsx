import { getArticlesByTag } from "@/lib/articles";
import { ArticleCard } from "@/components/article/ArticleCard";
import type { Metadata } from "next";
import Link from "next/link";

type Props = { params: Promise<{ tag: string }> };

export default async function TagPage({ params }: Props) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  const articles = getArticlesByTag(decodedTag);

  return (
    <main className="px-4 md:px-10 py-10" aria-labelledby="tag-heading">
      <header className="max-w-5xl mx-auto mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Link
            href="/articles"
            className="text-sm text-gray-400 hover:text-gray-300"
          >
            Articles
          </Link>
          <span className="text-sm text-gray-600">/</span>
          <span className="text-sm text-gray-400">Tag</span>
        </div>
        <h1
          id="tag-heading"
          className="text-3xl md:text-4xl font-bold tracking-tight text-gray-50"
        >
          Articles tagged &ldquo;{decodedTag}&rdquo;
        </h1>
        <p className="mt-2 text-gray-400">
          {articles.length} article{articles.length !== 1 ? "s" : ""} found
        </p>
      </header>

      <section aria-label="Article list" className="max-w-5xl mx-auto">
        {articles.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-800 bg-gray-900/40 p-8 text-center">
            <h2 className="text-lg font-semibold text-gray-100">
              No articles found
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              No articles have been tagged with &ldquo;{decodedTag}&rdquo; yet.
            </p>
            <div className="mt-6">
              <Link
                href="/articles"
                className="inline-flex items-center justify-center rounded-full bg-blue-500 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950"
              >
                View all articles
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
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

  return {
    title: `Articles tagged "${decodedTag}" | Knotic`,
    description: `Browse articles tagged with "${decodedTag}" on Knotic.`,
  };
}
