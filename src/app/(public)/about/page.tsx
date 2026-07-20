// app/(public)/about/page.tsx
import { buildMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import Buttons from "@/components/shared/button";

export default function AboutPage() {
  return (
    <main className="page-container py-12 space-y-12 editorial">
      {/* Header */}
      <section aria-labelledby="about-heading">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary-hover">
          Knowledge, structured for thinking
        </p>
        <h1
          id="about-heading"
          className="mt-4 text-4xl md:text-5xl font-bold tracking-tight text-text-primary"
        >
          About Knotic
        </h1>
        <p className="mt-4 text-base md:text-lg text-text-secondary">
          Knotic is a place for structured, thoughtful knowledge — built on the
          belief that writing is how ideas become real.
        </p>
      </section>

      {/* Why Knotic exists */}
      <section aria-labelledby="why-heading" className="space-y-6">
        <h2
          id="why-heading"
          className="text-2xl font-semibold text-text-primary"
        >
          Why Knotic exists
        </h2>
        <p className="text-text-secondary leading-relaxed">
          Most note-taking ends in a graveyard of scattered fragments. We
          capture ideas quickly, then never return to them. The result is
          passive consumption disguised as learning — storage without synthesis,
          input without understanding.
        </p>
        <p className="text-text-secondary leading-relaxed">
          Structured writing changes that. When you write to connect ideas — not
          just to record them — you force yourself to think clearly. Knotic is
          built around that process: turning raw thoughts into articles that
          actually hold together, tagged and linked so the relationships between
          ideas are visible, not buried.
        </p>
        <p className="text-text-secondary leading-relaxed">
          Retention comes from revisiting and rewriting, not rereading. Knotic
          gives you the tools to do that in public, which adds a layer of
          intention to the work. Every article here is a small act of committing
          an idea to a form worth sharing.
        </p>
      </section>

      {/* Built by */}
      <section aria-labelledby="built-by-heading" className="space-y-4">
        <h2
          id="built-by-heading"
          className="text-2xl font-semibold text-text-primary"
        >
          Built by
        </h2>
        <p className="text-text-secondary leading-relaxed">
          Knotic is an independent project by{" "}
          <a
            href="https://ilhamriz.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-primary hover:text-primary-hover font-medium transition-colors"
          >
            Ilhamriz
          </a>
          , built as part of a portfolio of work exploring modern web
          architecture, content systems, and thoughtful UI design. It&apos;s not
          a startup or a product — it&apos;s a working example of ideas put into
          practice.
        </p>
      </section>

      {/* CTA */}
      <section>
        <Buttons href="/articles" className="sm:w-fit">
          Read the articles
        </Buttons>
      </section>
    </main>
  );
}

export const metadata: Metadata = buildMetadata(
  "About | Knotic",
  "Learn why Knotic was built and the philosophy behind structured, thoughtful knowledge sharing.",
);
