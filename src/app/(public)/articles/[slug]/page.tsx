// app/(public)/articles/[slug]/page.tsx

import { getAllArticles, getArticleBySlug } from "@/lib/articles";
import { authOptions } from "@/lib/auth";
import { formatArticlePublishedDate } from "@/lib/utils";
import ArticleSummarizer from "@/components/article/ArticleSummarizer";
import type { Metadata } from "next";
import { getServerSession } from "next-auth/next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

const ArticlePage = async ({ params }: Props) => {
  const { slug } = await params;
  const [article, session] = await Promise.all([
    getArticleBySlug(slug),
    getServerSession(authOptions),
  ]);

  if (!article) {
    notFound();
  }

  if (article.status === "draft" && session?.user?.id !== article.authorId) {
    notFound();
  }

  const formattedDate = formatArticlePublishedDate(article.publishedAt);

  return (
    <main
      className="px-4 md:px-6 lg:px-0 editorial"
      aria-labelledby="article-title"
    >
      <article className="max-w-4xl mx-auto py-12 space-y-12">
        <div className="flex items-center gap-2 text-sm text-text-secondary">
          <Link
            href="/articles"
            className="hover:text-text-primary transition-colors"
          >
            Articles
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-text-primary truncate max-w-xs">
            {article.title}
          </span>
        </div>

        {/* Cover Image */}
        <div className="relative h-[300px] sm:h-[400px] lg:h-[500px] w-full overflow-hidden rounded-2xl border border-border-default bg-bg-surface">
          <Image
            src={article.coverImage}
            alt={`Cover image for ${article.title}`}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Article Header */}
        <header className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary">
              <span className="font-medium text-text-primary">
                {article.author}
              </span>
              <span aria-hidden="true" className="hidden sm:inline">
                •
              </span>
              <time
                dateTime={article.publishedAt}
                className="whitespace-nowrap"
              >
                {formattedDate}
              </time>
              <span aria-hidden="true" className="hidden sm:inline">
                •
              </span>
              <span className="whitespace-nowrap">{article.readingTime}</span>
            </div>
          </div>

          <h1
            id="article-title"
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-text-primary leading-tight"
          >
            {article.title}
          </h1>

          <p className="text-lg md:text-xl text-text-secondary max-w-3xl leading-relaxed">
            {article.excerpt}
          </p>

          {article.tags.length > 0 && (
            <div className="pt-4">
              <ul aria-label="Article tags" className="flex flex-wrap gap-3">
                {article.tags.map((tag) => (
                  <li key={tag}>
                    <Link
                      href={`/tags/${encodeURIComponent(tag)}`}
                      className="inline-flex items-center rounded-full bg-bg-elevated px-4 py-2 text-sm font-medium text-text-primary hover:bg-border-default transition-colors"
                    >
                      {tag}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </header>

        {/* AI Summarizer — only for authenticated users */}
        {session && (
          <ArticleSummarizer
            articleTitle={article.title}
            articleContent={article.content}
          />
        )}

        {/* Article Content */}
        <section
          aria-label="Article content"
          className="prose prose-invert prose-lg max-w-none prose-pre:bg-bg-surface prose-pre:border prose-pre:border-border-default"
        >
          <div dangerouslySetInnerHTML={{ __html: article.contentHtml }} />
        </section>
      </article>
    </main>
  );
};

export async function generateStaticParams() {
  try {
    return (await getAllArticles()).map((article) => ({
      slug: article.slug,
    }));
  } catch (error) {
    console.warn(
      "Failed to generate static params for articles. Database may not be available during build.",
      error,
    );
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article || article.status === "draft") {
    const notFoundTitle = "Article Not Found";
    const notFoundDescription =
      "The requested article could not be found on Knotic.";

    return {
      title: notFoundTitle,
      description: notFoundDescription,
      alternates: {
        canonical: "/articles",
      },
      openGraph: {
        title: notFoundTitle,
        description: notFoundDescription,
      },
      twitter: {
        title: notFoundTitle,
        description: notFoundDescription,
      },
    };
  }

  const title = article.title;
  const description = article.excerpt;

  return {
    title,
    description,
    alternates: {
      canonical: `/articles/${article.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `/articles/${article.slug}`,
      siteName: "Knotic",
      type: "article",
      images: [
        {
          url: article.coverImage,
          alt: `Cover image for ${article.title}`,
        },
      ],
    },
    twitter: {
      title,
      description,
    },
  };
}

export default ArticlePage;
