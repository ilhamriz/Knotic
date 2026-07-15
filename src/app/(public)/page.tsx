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
    <main className="px-4 md:px-10 lg:px-16 xl:px-24 py-12 space-y-28 md:space-y-36 editorial">
      {/* Hero */}
      <section
        aria-labelledby="hero-heading"
        className="page-container relative text-center md:text-left py-20 md:py-32"
      >
        {/* Decorative background blob — aria-hidden, does not affect layout */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        >
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 md:left-0 md:translate-x-0 h-[600px] w-[600px] rounded-full bg-primary/15 blur-[120px] opacity-60" />
        </div>

        <p className="text-sm md:text-base font-medium uppercase tracking-[0.25em] text-primary">
          Knowledge, structured for thinking
        </p>
        <h1
          id="hero-heading"
          className="mt-4 text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-text-primary"
        >
          Knotic helps you turn scattered notes into{" "}
          <span className="text-accent">clear, connected knowledge.</span>
        </h1>
        <p className="mt-6 text-base md:text-lg text-text-secondary max-w-2xl">
          Capture ideas, structure them with tags, and publish thoughtful
          articles. Built for people who care about how they think, not just
          what they store.
        </p>
        <div className="mt-12 flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-center">
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
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        aria-labelledby="features-heading"
        className="page-container"
      >
        <header className="mb-6 text-center md:text-left">
          <h2
            id="features-heading"
            className="text-3xl md:text-4xl font-semibold text-text-primary"
          >
            Built for deep, structured thinking.
          </h2>
          <p className="mt-2 text-sm md:text-base text-text-secondary">
            Knotic&apos;s core features are designed to help you move from raw
            notes to long-term understanding.
          </p>
        </header>
        <div className="grid gap-8 md:grid-cols-2">
          <div className="rounded-xl border border-border-default bg-bg-surface p-7 md:p-8">
            <p className="text-sm font-mono text-accent mb-2">01</p>
            <h3 className="text-lg font-semibold text-text-primary">
              Structured knowledge
            </h3>
            <p className="mt-2 text-sm text-text-secondary">
              Turn unstructured notes into organized articles. Group related
              ideas, connect concepts, and build a knowledge base that actually
              makes sense.
            </p>
          </div>
          <div className="rounded-xl border border-border-default bg-bg-surface p-7 md:p-8">
            <p className="text-sm font-mono text-accent mb-2">02</p>
            <h3 className="text-lg font-semibold text-text-primary">
              AI-assisted writing
            </h3>
            <p className="mt-2 text-sm text-text-secondary">
              Refine drafts, clarify explanations, and improve flow with AI
              support—while you stay fully in control of the final output.
            </p>
          </div>
          <div className="rounded-xl border border-dashed border-border-default bg-bg-surface/50 p-7 md:p-8">
            <p className="text-sm font-mono text-accent mb-2">03</p>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-text-primary">
                Real-time collaboration
              </h3>
              <span className="text-xs font-medium bg-bg-elevated text-accent border border-accent/30 rounded-full px-2.5 py-0.5">
                Planned
              </span>
            </div>
            <p className="mt-2 text-sm text-text-secondary">
              See updates as they happen, review changes together, and co-create
              articles without losing context—planned for future iterations of
              Knotic.
            </p>
          </div>
          <div className="rounded-xl border border-border-default bg-bg-surface p-7 md:p-8">
            <p className="text-sm font-mono text-accent mb-2">04</p>
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
        className="page-container"
      >
        <header className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-3">
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
          <div className="article-grid">
            {latestArticles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section aria-labelledby="cta-heading" className="page-container">
        <div className="rounded-2xl border border-primary/60 relative overflow-hidden px-8 py-12 md:px-12 md:py-16">
          {/* Layered gradients: primary base + accent depth layers at both corners */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10"
          >
            <div className="absolute inset-0 bg-linear-to-r from-primary/30 via-primary-muted/30 to-primary/30" />
            <div className="absolute -bottom-12 -right-12 h-80 w-80 rounded-full bg-accent/25 blur-[100px]" />
            <div className="absolute -top-8 -left-8 h-48 w-48 rounded-full bg-accent/15 blur-[90px]" />
          </div>
          <h2
            id="cta-heading"
            className="text-3xl md:text-4xl font-semibold text-text-primary"
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
              href="/about"
              className="inline-flex items-center justify-center rounded-full bg-bg-surface px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-bg-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base"
            >
              Learn more about Knotic
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
