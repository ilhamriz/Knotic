// app/(public)/page.tsx
import { ArticleCard } from "@/components/article/ArticleCard";
import { getAllArticles, type ArticlePreview } from "@/lib/articles";
import type { Metadata } from "next";
import Link from "next/link";

export default async function Home() {
  let latestArticles: ArticlePreview[] = [];

  try {
    latestArticles = (await getAllArticles()).slice(0, 3);
  } catch (error) {
    console.warn(
      "Failed to fetch articles for home page. Database may not be available during build.",
      error,
    );
  }

  return (
    <main className="px-4 md:px-10 lg:px-16 xl:px-24 py-12 space-y-16">
      {/* Hero */}
      <section
        aria-labelledby="hero-heading"
        className="max-w-5xl mx-auto text-center md:text-left"
      >
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
          Knowledge, structured for thinking
        </p>
        <h1
          id="hero-heading"
          className="mt-4 text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-text-primary"
        >
          Knotic helps you turn scattered notes into clear, connected knowledge.
        </h1>
        <p className="mt-4 text-base md:text-lg text-text-secondary max-w-2xl">
          Capture ideas, structure them with tags, and publish thoughtful
          articles. Built for people who care about how they think, not just
          what they store.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-center">
          <Link
            href="/articles"
            className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base"
          >
            Explore the articles
          </Link>
          <Link
            href="/search"
            className="inline-flex items-center justify-center rounded-full border border-border-default px-6 py-2.5 text-sm font-semibold text-text-primary hover:border-border-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base"
          >
            Search articles
          </Link>
          <Link
            href="/write"
            className="inline-flex items-center justify-center rounded-full border border-primary bg-primary-muted px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base"
          >
            Write a new article
          </Link>
          <Link
            href="#features"
            className="inline-flex items-center justify-center rounded-full border border-border-default px-6 py-2.5 text-sm font-semibold text-text-primary hover:border-border-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base"
          >
            See how Knotic works
          </Link>
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        aria-labelledby="features-heading"
        className="max-w-5xl mx-auto"
      >
        <header className="mb-6 text-center md:text-left">
          <h2
            id="features-heading"
            className="text-2xl md:text-3xl font-semibold text-text-primary"
          >
            Built for deep, structured thinking.
          </h2>
          <p className="mt-2 text-sm md:text-base text-text-secondary">
            Knotic&apos;s core features are designed to help you move from raw
            notes to long-term understanding.
          </p>
        </header>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-border-default bg-bg-surface p-5">
            <h3 className="text-lg font-semibold text-text-primary">
              Structured knowledge
            </h3>
            <p className="mt-2 text-sm text-text-secondary">
              Turn unstructured notes into organized articles. Group related
              ideas, connect concepts, and build a knowledge base that actually
              makes sense.
            </p>
          </div>
          <div className="rounded-xl border border-border-default bg-bg-surface p-5">
            <h3 className="text-lg font-semibold text-text-primary">
              AI-assisted writing
            </h3>
            <p className="mt-2 text-sm text-text-secondary">
              Refine drafts, clarify explanations, and improve flow with AI
              support—while you stay fully in control of the final output.
            </p>
          </div>
          <div className="rounded-xl border border-border-default bg-bg-surface p-5">
            <h3 className="text-lg font-semibold text-text-primary">
              Real-time collaboration (future)
            </h3>
            <p className="mt-2 text-sm text-text-secondary">
              See updates as they happen, review changes together, and co-create
              articles without losing context—planned for future iterations of
              Knotic.
            </p>
          </div>
          <div className="rounded-xl border border-border-default bg-bg-surface p-5">
            <h3 className="text-lg font-semibold text-text-primary">
              Tag-based organization
            </h3>
            <p className="mt-2 text-sm text-text-secondary">
              Use flexible tags to group themes, projects, and topics. Filter
              your content quickly without forcing everything into a rigid
              folder tree.
            </p>
          </div>
        </div>
      </section>

      {/* Articles Preview */}
      <section
        aria-labelledby="articles-preview-heading"
        className="max-w-5xl mx-auto"
      >
        <header className="mb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-3">
          <div>
            <h2
              id="articles-preview-heading"
              className="text-2xl md:text-3xl font-semibold text-text-primary"
            >
              From the Knotic articles
            </h2>
            <p className="mt-2 text-sm md:text-base text-text-secondary">
              Recent articles on structured thinking, writing, and building
              modern knowledge tools.
            </p>
          </div>
          <Link
            href="/articles"
            className="text-sm font-medium text-primary hover:text-primary-hover"
          >
            View all articles
          </Link>
        </header>
        {latestArticles.length === 0 ? (
          <p className="text-sm text-text-secondary">
            No articles have been published yet. Check back soon for new posts.
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {latestArticles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section aria-labelledby="cta-heading" className="max-w-5xl mx-auto">
        <div className="rounded-2xl border border-primary bg-linear-to-r from-blue-600/30 via-purple-600/30 to-blue-500/30 px-6 py-8 md:px-8 md:py-10">
          <h2
            id="cta-heading"
            className="text-2xl md:text-3xl font-semibold text-text-primary"
          >
            Build a thinking space you&apos;re proud of.
          </h2>
          <p className="mt-3 text-sm md:text-base text-text-primary max-w-2xl">
            Knotic is still early, but the foundations are focused on
            high-quality writing, clear structure, and a modern content
            architecture. Follow the articles to see how it evolves.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-center">
            <Link
              href="/articles"
              className="inline-flex items-center justify-center rounded-full bg-bg-surface px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base"
            >
              Read the latest articles
            </Link>
            <Link
              href="#features"
              className="inline-flex items-center justify-center rounded-full border border-white/40 px-6 py-2.5 text-sm font-semibold text-white/90 hover:border-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base"
            >
              Learn about the product vision
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export const metadata: Metadata = {
  title: "Knotic - Knowledge made simple",
  description: "Organize and discover knowledge with AI assistance.",
};
