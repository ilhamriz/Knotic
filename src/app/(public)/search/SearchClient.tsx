"use client";

import { ArticleCard } from "@/components/article/ArticleCard";
import { useState, useMemo } from "react";
import type { ArticlePreview } from "@/lib/articles";

interface SearchClientProps {
  readonly articles: ArticlePreview[];
}

export default function SearchClient({ articles }: SearchClientProps) {
  const [query, setQuery] = useState("");

  const filteredArticles = useMemo(() => {
    if (!query.trim()) return [];

    const searchTerm = query.toLowerCase().trim();
    return articles.filter((article) => {
      const titleMatch = article.title.toLowerCase().includes(searchTerm);
      const excerptMatch = article.excerpt.toLowerCase().includes(searchTerm);
      const tagsMatch = article.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm),
      );
      return titleMatch || excerptMatch || tagsMatch;
    });
  }, [query, articles]);

  const renderContent = () => {
    // 1. Initial State: No query entered
    if (!query.trim()) {
      return (
        <div className="rounded-xl border border-dashed border-gray-800 bg-gray-900/40 p-12 text-center">
          <h2 className="text-xl font-semibold text-gray-100 mb-2">
            Start searching
          </h2>
          <p className="text-gray-400">
            Enter a search term to find articles by title, excerpt, or tags.
          </p>
        </div>
      );
    }

    // 2. Empty State: Query entered but no matches
    if (filteredArticles.length === 0) {
      return (
        <div className="rounded-xl border border-dashed border-gray-800 bg-gray-900/40 p-12 text-center">
          <h2 className="text-xl font-semibold text-gray-100 mb-2">
            No results found
          </h2>
          <p className="text-gray-400 mb-6">
            No articles match &ldquo;{query}&rdquo;. Try different keywords.
          </p>
        </div>
      );
    }

    // 3. Success State: Display results
    return (
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredArticles.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>
    );
  };

  return (
    <main className="px-4 md:px-10 py-10" aria-labelledby="search-heading">
      <header className="max-w-5xl mx-auto mb-8">
        <h1
          id="search-heading"
          className="text-3xl md:text-4xl font-bold tracking-tight text-gray-50 mb-6"
        >
          Search Articles
        </h1>

        <div className="max-w-2xl">
          <label htmlFor="search-input" className="sr-only">
            Search articles
          </label>
          <input
            id="search-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, excerpt, or tags..."
            className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        {query.trim() && (
          <p className="mt-4 text-sm text-gray-400">
            {filteredArticles.length} result
            {filteredArticles.length !== 1 ? "s" : ""} for &ldquo;{query}&rdquo;
          </p>
        )}
      </header>

      <section aria-label="Search results" className="max-w-5xl mx-auto">
        {renderContent()}
      </section>
    </main>
  );
}
