import { getAllArticles, getArticleBySlug } from "@/lib/articles";
import { formatArticlePublishedDate } from "@/lib/utils";
import type { Metadata } from "next";
import Image from "next/image";
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
      <article className="max-w-3xl mx-auto py-12 space-y-8">
        <header className="space-y-4">
          <p className="text-sm text-gray-400">
            <span className="font-medium text-gray-200">{article.author}</span>
            <span aria-hidden="true" className="px-2">
              •
            </span>
            <time dateTime={article.publishedAt}>{formattedDate}</time>
            <span aria-hidden="true" className="px-2">
              •
            </span>
            <span>{article.readingTime}</span>
          </p>

          <h1
            id="article-title"
            className="text-3xl md:text-4xl font-bold tracking-tight text-gray-50"
          >
            {article.title}
          </h1>

          <p className="text-base text-gray-400 max-w-2xl">{article.excerpt}</p>

          {article.tags.length > 0 && (
            <ul aria-label="Article tags" className="flex flex-wrap gap-2 pt-2">
              {article.tags.map((tag) => (
                <li key={tag}>
                  <span className="inline-flex items-center rounded-full bg-gray-800 px-3 py-1 text-xs font-medium text-gray-100">
                    {tag}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </header>

        <figure className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900/40">
          <Image
            src={article.coverImage}
            alt={`Cover image for ${article.title}`}
            width={1200}
            height={630}
            className="h-auto w-full object-cover"
            priority
          />
        </figure>

        <section
          aria-label="Article content"
          className="prose prose-invert max-w-none leading-relaxed"
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
        canonical: "/blog",
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

  const title = `${article.title} | Knotic Blog`;
  const description = article.excerpt;

  return {
    title,
    description,
    alternates: {
      canonical: `/blog/${article.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `/blog/${article.slug}`,
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
