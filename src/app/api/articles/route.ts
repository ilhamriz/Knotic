import { Article } from "@/lib/articles";
import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";

const DATA_DIR = path.join(process.cwd(), "src", "data");
const DATA_FILE = path.join(DATA_DIR, "articles.json");

function makeSlug(title: string) {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function calculateReadingTime(text: string) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const wordsPerMinute = 200;
  const minutes = Math.max(1, Math.ceil(words / wordsPerMinute));
  return `${minutes} min read`;
}

function readArticles() {
  if (!fs.existsSync(DATA_FILE)) return [];

  try {
    const raw = fs.readFileSync(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    // ignore malformed file
  }

  return [];
}

function writeArticles(articles: Article[]) {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  fs.writeFileSync(DATA_FILE, JSON.stringify(articles, null, 2), "utf8");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, excerpt, coverImage, tags, content, author } = body;

    if (
      typeof title !== "string" ||
      typeof excerpt !== "string" ||
      typeof coverImage !== "string" ||
      typeof content !== "string" ||
      typeof author !== "string" ||
      (typeof tags !== "string" && !Array.isArray(tags))
    ) {
      return NextResponse.json(
        { error: "Invalid article payload" },
        { status: 400 },
      );
    }

    const normalizedTags = Array.isArray(tags)
      ? tags.filter((t) => typeof t === "string").map((t) => t.trim())
      : tags
          .split(",")
          .map((t: string) => t.trim())
          .filter(Boolean);

    const slugBase = makeSlug(title);
    const existing = readArticles();

    let slug = slugBase;
    let counter = 1;
    while (existing.some((item) => item.slug === slug)) {
      slug = `${slugBase}-${counter}`;
      counter += 1;
    }

    const publishedAt = new Date().toISOString();
    const readingTime = calculateReadingTime(content);

    const newArticle = {
      slug,
      title,
      excerpt,
      coverImage,
      tags: normalizedTags,
      content,
      author,
      publishedAt,
      readingTime,
    };

    const updated = [...existing, newArticle];
    writeArticles(updated);

    return NextResponse.json({ article: newArticle }, { status: 201 });
  } catch (error) {
    console.error("Failed to create article", error);
    return NextResponse.json(
      { error: "Could not create article" },
      { status: 500 },
    );
  }
}
