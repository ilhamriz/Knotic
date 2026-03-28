import { getAllArticles, getArticleBySlug } from "@/lib/articles";
import { formatArticlePublishedDate } from "@/lib/utils";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

const ArticlePage = async ({ params }: Props) => {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const formattedDate = formatArticlePublishedDate(article.publishedAt);

  return (
    <main className="px-4 md:px-6 lg:px-0" aria-labelledby="article-title">
      <article className="max-w-4xl mx-auto py-12 space-y-12">
        {/* Cover Image */}
        <div className="relative h-[300px] sm:h-[400px] lg:h-[500px] w-full overflow-hidden rounded-2xl border border-gray-800 bg-gray-900/40">
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
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
              <span className="font-medium text-gray-200">
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
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-50 leading-tight"
          >
            {article.title}
          </h1>

          <p className="text-lg md:text-xl text-gray-300 max-w-3xl leading-relaxed">
            {article.excerpt}
          </p>

          {article.tags.length > 0 && (
            <div className="pt-4">
              <ul aria-label="Article tags" className="flex flex-wrap gap-3">
                {article.tags.map((tag) => (
                  <li key={tag}>
                    <Link
                      href={`/tags/${encodeURIComponent(tag)}`}
                      className="inline-flex items-center rounded-full bg-gray-800 px-4 py-2 text-sm font-medium text-gray-100 hover:bg-gray-700 transition-colors"
                    >
                      {tag}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </header>

        {/* Article Content */}
        <section
          aria-label="Article content"
          className="prose prose-invert prose-lg max-w-none prose-pre:bg-gray-900 prose-pre:border prose-pre:border-gray-700"
        >
          <div dangerouslySetInnerHTML={{ __html: article.contentHtml }} />
        </section>
      </article>
    </main>
  );
};

export async function generateStaticParams() {
  return getAllArticles().map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    const notFoundTitle = "Article Not Found | Knotic";
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

  const title = `${article.title} | Knotic Articles`;
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
