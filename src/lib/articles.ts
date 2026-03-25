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
const ARTICLES_DATA_DIR = path.join(process.cwd(), "src", "data");
const ARTICLES_JSON_PATH = path.join(ARTICLES_DATA_DIR, "articles.json");

function slugFromFilename(filename: string) {
  return filename.replace(/\.md$/, "");
}

function getArticleFilePath(slug: string) {
  return path.join(ARTICLES_DIR, `${slug}.md`);
}

export function calculateReadingTimeFromText(text: string) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const wordsPerMinute = 200;
  const minutes = Math.max(1, Math.ceil(words / wordsPerMinute));
  return `${minutes} min read`;
}

function ensureArticlesDataDir() {
  if (!fs.existsSync(ARTICLES_DATA_DIR)) {
    fs.mkdirSync(ARTICLES_DATA_DIR, { recursive: true });
  }
}

function readJsonArticles(): Array<ArticlePreview & { content: string }> {
  if (!fs.existsSync(ARTICLES_JSON_PATH)) {
    return [];
  }

  try {
    const raw = fs.readFileSync(ARTICLES_JSON_PATH, "utf8");
    const items = JSON.parse(raw);
    if (!Array.isArray(items)) return [];

    return items
      .filter((item) => {
        return (
          item &&
          typeof item === "object" &&
          typeof item.slug === "string" &&
          typeof item.title === "string" &&
          typeof item.publishedAt === "string" &&
          typeof item.excerpt === "string" &&
          typeof item.coverImage === "string" &&
          typeof item.author === "string" &&
          Array.isArray(item.tags) &&
          item.tags.every((t: unknown) => typeof t === "string") &&
          typeof item.content === "string"
        );
      })
      .map((item) => ({
        slug: item.slug,
        title: item.title,
        publishedAt: item.publishedAt,
        excerpt: item.excerpt,
        coverImage: item.coverImage,
        author: item.author,
        tags: item.tags,
        content: item.content,
        readingTime: calculateReadingTimeFromText(item.content),
      }));
  } catch {
    return [];
  }
}

function getJsonArticleBySlug(
  slug: string,
): (ArticlePreview & { content: string }) | null {
  const jsonArticles = readJsonArticles();
  const match = jsonArticles.find((article) => article.slug === slug);
  return match || null;
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
  const previews: ArticlePreview[] = [];

  if (fs.existsSync(ARTICLES_DIR)) {
    const filenames = fs
      .readdirSync(ARTICLES_DIR)
      .filter((name) => name.endsWith(".md"));

    previews.push(
      ...filenames.map((filename) => {
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
      }),
    );
  }

  const jsonArticles = readJsonArticles();
  previews.push(
    ...jsonArticles.map((article) => ({
      slug: article.slug,
      title: article.title,
      publishedAt: article.publishedAt,
      excerpt: article.excerpt,
      coverImage: article.coverImage,
      author: article.author,
      tags: article.tags,
      readingTime: calculateReadingTimeFromText(article.content),
    })),
  );

  return previews.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const filePath = getArticleFilePath(slug);

  if (fs.existsSync(filePath)) {
    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContents);
    const frontmatter = assertFrontmatter(
      data as Record<string, unknown>,
      slug,
    );

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

  const jsonArticle = getJsonArticleBySlug(slug);
  if (jsonArticle) {
    const processed = await remark().use(html).process(jsonArticle.content);
    const contentHtml = processed.toString();
    return {
      slug: jsonArticle.slug,
      title: jsonArticle.title,
      excerpt: jsonArticle.excerpt,
      coverImage: jsonArticle.coverImage,
      author: jsonArticle.author,
      tags: jsonArticle.tags,
      publishedAt: jsonArticle.publishedAt,
      content: jsonArticle.content,
      contentHtml,
      readingTime: calculateReadingTimeFromText(jsonArticle.content),
    };
  }

  return null;
}
