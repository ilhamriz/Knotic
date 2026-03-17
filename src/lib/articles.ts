import fs from "node:fs";
import path from "node:path";

import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

export type ArticleFrontmatter = {
  title: string;
  publishedAt: string; // ISO date string
  excerpt: string;
  coverImage: string;
  author: string;
  tags: string[];
};

export type ArticlePreview = ArticleFrontmatter & {
  slug: string;
  readingTime: string;
};

export type Article = ArticleFrontmatter & {
  slug: string;
  content: string; // raw markdown
  contentHtml: string;
  readingTime: string;
};

const ARTICLES_DIR = path.join(process.cwd(), "src", "content", "articles");

function slugFromFilename(filename: string) {
  return filename.replace(/\.md$/, "");
}

function getArticleFilePath(slug: string) {
  return path.join(ARTICLES_DIR, `${slug}.md`);
}

function calculateReadingTimeFromText(text: string) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const wordsPerMinute = 200;
  const minutes = Math.max(1, Math.ceil(words / wordsPerMinute));
  return `${minutes} min read`;
}

function assertFrontmatter(
  data: Record<string, unknown>,
  slug: string,
): ArticleFrontmatter {
  const title = data.title;
  const publishedAt = data.publishedAt;
  const excerpt = data.excerpt;
  const coverImage = data.coverImage;
  const author = data.author;
  const tags = data.tags;

  if (
    typeof title !== "string" ||
    typeof publishedAt !== "string" ||
    typeof excerpt !== "string" ||
    typeof coverImage !== "string" ||
    typeof author !== "string" ||
    !Array.isArray(tags) ||
    !tags.every((t) => typeof t === "string")
  ) {
    throw new Error(`Invalid frontmatter for article "${slug}"`);
  }

  return {
    title,
    publishedAt,
    excerpt,
    coverImage,
    author,
    tags,
  };
}

export function getAllArticles(): ArticlePreview[] {
  if (!fs.existsSync(ARTICLES_DIR)) return [];

  const filenames = fs
    .readdirSync(ARTICLES_DIR)
    .filter((name) => name.endsWith(".md"));

  const previews = filenames.map((filename) => {
    const slug = slugFromFilename(filename);
    const fileContents = fs.readFileSync(getArticleFilePath(slug), "utf8");
    const { data, content } = matter(fileContents);
    const frontmatter = assertFrontmatter(
      data as Record<string, unknown>,
      slug,
    );

    return {
      slug,
      ...frontmatter,
      readingTime: calculateReadingTimeFromText(content),
    };
  });

  return previews.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const filePath = getArticleFilePath(slug);
  if (!fs.existsSync(filePath)) return null;

  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContents);
  const frontmatter = assertFrontmatter(data as Record<string, unknown>, slug);

  const processed = await remark().use(html).process(content);
  const contentHtml = processed.toString();

  return {
    slug,
    ...frontmatter,
    content,
    contentHtml,
    readingTime: calculateReadingTimeFromText(content),
  };
}
