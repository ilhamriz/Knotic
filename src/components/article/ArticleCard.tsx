import type { ArticlePreview } from "@/lib/articles";
import { formatArticlePublishedDate } from "@/lib/utils";
import Link from "next/link";

type ArticleCardProps = {
  article: ArticlePreview;
};

export function ArticleCard({ article }: ArticleCardProps) {
  const formattedDate = formatArticlePublishedDate(article.publishedAt);

  return (
    <article className="flex flex-col justify-between rounded-xl bg-gray-900/80 border border-gray-800 p-5 shadow-sm hover:border-gray-700 transition-colors">
      <header className="space-y-2">
        <p className="text-xs text-gray-400">
          <span className="font-medium text-gray-200">{article.author}</span>
          <span aria-hidden="true" className="px-1.5">
            •
          </span>
          <time dateTime={article.publishedAt}>{formattedDate}</time>
          <span aria-hidden="true" className="px-1.5">
            •
          </span>
          <span>{article.readingTime}</span>
        </p>

        <h2 className="text-lg font-semibold text-gray-50 line-clamp-2">
          {article.title}
        </h2>

        <p className="text-sm text-gray-400 line-clamp-3">{article.excerpt}</p>

        {article.tags.length > 0 && (
          <ul
            aria-label="Article tags"
            className="mt-2 flex flex-wrap gap-1.5"
          >
            {article.tags.map((tag) => (
              <li key={tag}>
                <span className="inline-flex items-center rounded-full bg-gray-800 px-2.5 py-0.5 text-[11px] font-medium text-gray-100">
                  {tag}
                </span>
              </li>
            ))}
          </ul>
        )}
      </header>

      <footer className="mt-4">
        <Link
          href={`/blog/${article.slug}`}
          className="inline-flex items-center text-sm font-medium text-blue-400 hover:text-blue-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950 rounded-md"
          aria-label={`Read full article: ${article.title}`}
        >
          Read article
          <span aria-hidden="true" className="ml-1">
            →
          </span>
        </Link>
      </footer>
    </article>
  );
}

