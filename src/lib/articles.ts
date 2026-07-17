// lib/articles.ts

import { prisma } from "./prisma";
import { remark } from "remark";
import remarkRehype from "remark-rehype";
import rehypeHighlight from "rehype-highlight";
import rehypeStringify from "rehype-stringify";

export type ArticleFrontmatter = {
  title: string;
  publishedAt: string;
  excerpt: string;
  coverImage: string;
  author: string;
  tags: string[];
};

export type ArticlePreview = ArticleFrontmatter & {
  slug: string;
  readingTime: string;
  status: string;
  authorId?: string;
  authorName?: string;
  authorEmail?: string;
};

export type Article = ArticleFrontmatter & {
  slug: string;
  content: string;
  contentHtml: string;
  readingTime: string;
  status: string;
  authorId?: string;
  authorName?: string;
  authorEmail?: string;
};

export function calculateReadingTimeFromText(text: string) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const wordsPerMinute = 200;
  const minutes = Math.max(1, Math.ceil(words / wordsPerMinute));
  return `${minutes} min read`;
}

export async function getAllArticles(): Promise<ArticlePreview[]> {
  const articles = await prisma.article.findMany({
    where: { status: "published" },
    include: {
      author: true,
    },
    orderBy: {
      publishedAt: "desc",
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return articles.map((article: any) => ({
    slug: article.slug,
    title: article.title,
    publishedAt: article.publishedAt.toISOString(),
    excerpt: article.excerpt,
    coverImage: article.coverImage || "",
    author: article.author?.name || "Unknown",
    authorId: article.authorId,
    authorName: article.author?.name || undefined,
    authorEmail: article.author?.email || undefined,
    tags: article.tags,
    status: article.status,
    readingTime: `${article.readingTime} min read`,
  }));
}

export async function getArticlesByTag(tag: string): Promise<ArticlePreview[]> {
  const allArticles = await getAllArticles();
  return allArticles.filter((article) =>
    article.tags.some((t) => t.toLowerCase() === tag.toLowerCase()),
  );
}

export async function getUserArticles(
  authorId: string,
): Promise<ArticlePreview[]> {
  const articles = await prisma.article.findMany({
    where: {
      authorId,
    },
    include: {
      author: true,
    },
    orderBy: {
      publishedAt: "desc",
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return articles.map((article: any) => ({
    slug: article.slug,
    title: article.title,
    publishedAt: article.publishedAt.toISOString(),
    excerpt: article.excerpt,
    coverImage: article.coverImage || "",
    author: article.author?.name || "Unknown",
    authorId: article.authorId,
    authorName: article.author?.name || undefined,
    authorEmail: article.author?.email || undefined,
    tags: article.tags,
    status: article.status,
    readingTime: `${article.readingTime} min read`,
  }));
}

function stripDuplicateTitleHeading(content: string, title: string): string {
  const lines = content.trimStart().split("\n");
  const normalizedTitle = title.trim().toLowerCase();

  // Scan the first 3 non-empty lines for a leading H1 heading
  let headingLineIndex = -1;
  let nonEmptyCount = 0;
  for (let i = 0; i < lines.length && nonEmptyCount < 3; i++) {
    const trimmed = lines[i].trim();
    if (trimmed === "") continue;
    nonEmptyCount++;
    if (trimmed.startsWith("# ")) {
      const headingText = trimmed.slice(2).trim().toLowerCase();
      const isDuplicate =
        headingText === normalizedTitle ||
        normalizedTitle.includes(headingText) ||
        headingText.includes(normalizedTitle);
      if (isDuplicate) {
        headingLineIndex = i;
      }
    }
    // Stop scanning once we hit the first non-empty, non-heading line —
    // a heading only counts as "leading" if nothing but blank lines precede it
    break;
  }

  if (headingLineIndex === -1) return content;

  const remaining = [
    ...lines.slice(0, headingLineIndex),
    ...lines.slice(headingLineIndex + 1),
  ].join("\n");
  return remaining.trimStart();
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const article = await prisma.article.findUnique({
    where: { slug },
    include: {
      author: true,
    },
  });

  if (!article) {
    return null;
  }

  const cleanedContent = stripDuplicateTitleHeading(
    article.content,
    article.title,
  );
  const processed = await remark()
    .use(remarkRehype)
    .use(rehypeHighlight)
    .use(rehypeStringify)
    .process(cleanedContent);
  const contentHtml = processed.toString();

  return {
    slug: article.slug,
    title: article.title,
    publishedAt: article.publishedAt.toISOString(),
    excerpt: article.excerpt,
    coverImage: article.coverImage || "",
    author: article.author?.name || "Unknown",
    authorId: article.authorId,
    authorName: article.author?.name || undefined,
    authorEmail: article.author?.email || undefined,
    tags: article.tags,
    status: article.status,
    content: article.content,
    contentHtml,
    readingTime: `${article.readingTime} min read`,
  };
}
