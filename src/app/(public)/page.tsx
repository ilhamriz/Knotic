import { ArticleCard } from "@/components/article/ArticleCard";
import { getAllArticles } from "@/lib/articles";
import type { Metadata } from "next";
import Link from "next/link";

export default function Home() {
  const latestArticles = getAllArticles().slice(0, 3);

  return (
    <main className="px-4 md:px-10 lg:px-16 xl:px-24 py-12 space-y-16">
      {/* Hero */}
      <section
        aria-labelledby="hero-heading"
        className="max-w-5xl mx-auto text-center md:text-left"
      >
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-300">
          Knowledge, structured for thinking
        </p>
        <h1
          id="hero-heading"
          className="mt-4 text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-50"
        >
          Knotic helps you turn scattered notes into clear, connected knowledge.
        </h1>
        <p className="mt-4 text-base md:text-lg text-gray-300 max-w-2xl">
          Capture ideas, structure them with tags, and publish thoughtful
          articles. Built for people who care about how they think, not just
          what they store.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-center">
          <Link
            href="/articles"
            className="inline-flex items-center justify-center rounded-full bg-blue-500 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950"
          >
            Explore the articles
          </Link>
          <Link
            href="#features"
            className="inline-flex items-center justify-center rounded-full border border-gray-700 px-6 py-2.5 text-sm font-semibold text-gray-100 hover:border-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950"
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
            className="text-2xl md:text-3xl font-semibold text-gray-50"
          >
            Built for deep, structured thinking.
          </h2>
          <p className="mt-2 text-sm md:text-base text-gray-400">
            Knotic&apos;s core features are designed to help you move from raw
            notes to long-term understanding.
          </p>
        </header>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-5">
            <h3 className="text-lg font-semibold text-gray-50">
              Structured knowledge
            </h3>
            <p className="mt-2 text-sm text-gray-400">
              Turn unstructured notes into organized articles. Group related
              ideas, connect concepts, and build a knowledge base that actually
              makes sense.
            </p>
          </div>
          <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-5">
            <h3 className="text-lg font-semibold text-gray-50">
              AI-assisted writing
            </h3>
            <p className="mt-2 text-sm text-gray-400">
              Refine drafts, clarify explanations, and improve flow with AI
              support—while you stay fully in control of the final output.
            </p>
          </div>
          <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-5">
            <h3 className="text-lg font-semibold text-gray-50">
              Real-time collaboration (future)
            </h3>
            <p className="mt-2 text-sm text-gray-400">
              See updates as they happen, review changes together, and co-create
              articles without losing context—planned for future iterations of
              Knotic.
            </p>
          </div>
          <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-5">
            <h3 className="text-lg font-semibold text-gray-50">
              Tag-based organization
            </h3>
            <p className="mt-2 text-sm text-gray-400">
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
              className="text-2xl md:text-3xl font-semibold text-gray-50"
            >
              From the Knotic articles
            </h2>
            <p className="mt-2 text-sm md:text-base text-gray-400">
              Recent articles on structured thinking, writing, and building
              modern knowledge tools.
            </p>
          </div>
          <Link
            href="/articles"
            className="text-sm font-medium text-blue-400 hover:text-blue-300"
          >
            View all articles
          </Link>
        </header>
        {latestArticles.length === 0 ? (
          <p className="text-sm text-gray-400">
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
        <div className="rounded-2xl border border-blue-500/40 bg-linear-to-r from-blue-600/30 via-purple-600/30 to-blue-500/30 px-6 py-8 md:px-8 md:py-10">
          <h2
            id="cta-heading"
            className="text-2xl md:text-3xl font-semibold text-gray-50"
          >
            Build a thinking space you&apos;re proud of.
          </h2>
          <p className="mt-3 text-sm md:text-base text-blue-50/90 max-w-2xl">
            Knotic is still early, but the foundations are focused on
            high-quality writing, clear structure, and a modern content
            architecture. Follow the articles to see how it evolves.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-center">
            <Link
              href="/articles"
              className="inline-flex items-center justify-center rounded-full bg-gray-950/80 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950"
            >
              Read the latest articles
            </Link>
            <Link
              href="#features"
              className="inline-flex items-center justify-center rounded-full border border-white/40 px-6 py-2.5 text-sm font-semibold text-white/90 hover:border-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950"
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
