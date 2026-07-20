import type { ArticlePreview } from "@/lib/articles";
import { formatArticlePublishedDate } from "@/lib/utils";
import Link from "next/link";
import Buttons from "../shared/button";

type ArticleCardProps = {
  article: ArticlePreview;
};

export function ArticleCard({ article }: ArticleCardProps) {
  const formattedDate = formatArticlePublishedDate(article.publishedAt);

  return (
    <article className="flex flex-col justify-between rounded-xl bg-bg-surface border border-border-default p-5 shadow-sm hover:border-border-strong transition-colors">
      <header className="space-y-2">
        <p className="text-xs text-text-secondary">
          <span className="font-medium text-text-primary">
            {article.author}
          </span>
          <span aria-hidden="true" className="px-1.5">
            •
          </span>
          <time dateTime={article.publishedAt}>{formattedDate}</time>
          <span aria-hidden="true" className="px-1.5">
            •
          </span>
          <span>{article.readingTime}</span>
        </p>

        <h2 className="text-lg font-semibold text-text-primary line-clamp-2">
          {article.title}
        </h2>

        <p className="text-sm text-text-secondary line-clamp-3">
          {article.excerpt}
        </p>

        {article.tags.length > 0 && (
          <ul aria-label="Article tags" className="mt-2 flex flex-wrap gap-1.5">
            {article.tags.map((tag) => (
              <li key={tag}>
                <Link
                  href={`/tags/${encodeURIComponent(tag)}`}
                  className="inline-flex items-center rounded-full bg-bg-elevated px-2.5 py-0.5 text-[11px] font-medium text-text-primary hover:bg-border-default transition-colors"
                >
                  {tag}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </header>

      <footer className="mt-4">
        <Buttons
          intent="textLink"
          href={`/articles/${article.slug}`}
          aria-label={`Read full article: ${article.title}`}
          className="p-0 min-w-auto w-fit h-fit!"
        >
          Read article
          <span
            aria-hidden="true"
            className="group-hover:translate-x-1 transition-all duration-300"
          >
            →
          </span>
        </Buttons>
      </footer>
    </article>
  );
}
