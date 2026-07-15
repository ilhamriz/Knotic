// app/(public)/search/SearchClient.tsx
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
        <div className="rounded-xl border border-dashed border-border-default bg-bg-surface p-12 text-center">
          <h2 className="text-xl font-semibold text-text-primary mb-2">
            Start searching
          </h2>
          <p className="text-text-secondary">
            Enter a search term to find articles by title, excerpt, or tags.
          </p>
        </div>
      );
    }

    // 2. Empty State: Query entered but no matches
    if (filteredArticles.length === 0) {
      return (
        <div className="rounded-xl border border-dashed border-border-default bg-bg-surface p-12 text-center">
          <h2 className="text-xl font-semibold text-text-primary mb-2">
            No results found
          </h2>
          <p className="text-text-secondary mb-6">
            No articles match &ldquo;{query}&rdquo;. Try different keywords.
          </p>
        </div>
      );
    }

    // 3. Success State: Display results
    return (
      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        {filteredArticles.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>
    );
  };

  return (
    <main
      className="px-4 md:px-10 py-10 editorial"
      aria-labelledby="search-heading"
    >
      <header className="page-container mb-12 md:mb-16">
        <h1
          id="search-heading"
          className="text-4xl md:text-5xl font-bold tracking-tight text-text-primary mb-6"
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
            className="w-full rounded-lg border border-border-default bg-bg-surface px-5 py-3.5 text-base text-text-primary placeholder-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {query.trim() && (
          <p className="mt-4 text-sm text-text-secondary">
            {filteredArticles.length} result
            {filteredArticles.length !== 1 ? "s" : ""} for &ldquo;{query}&rdquo;
          </p>
        )}
      </header>

      <section aria-label="Search results" className="page-container">
        {renderContent()}
      </section>
    </main>
  );
}
