import { getAllArticles } from "@/lib/articles";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";

const DATA_DIR = path.join(process.cwd(), "src", "data");
const DATA_FILE = path.join(DATA_DIR, "articles.json");

type StoredArticle = {
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  tags: string[];
  content: string;
  authorId: string;
  authorName: string;
  authorEmail: string;
  publishedAt: string;
  readingTime: string;
};

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

function writeArticles(articles: StoredArticle[]) {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  fs.writeFileSync(DATA_FILE, JSON.stringify(articles, null, 2), "utf8");
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, excerpt, coverImage, tags, content } = body;

    if (
      typeof title !== "string" ||
      typeof excerpt !== "string" ||
      typeof coverImage !== "string" ||
      typeof content !== "string" ||
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
    const allArticles = getAllArticles();

    let slug = slugBase;
    let counter = 1;
    while (allArticles.some((item) => item.slug === slug)) {
      slug = `${slugBase}-${counter}`;
      counter += 1;
    }

    const publishedAt = new Date().toISOString();
    const readingTime = calculateReadingTime(content);
    const authorId = session.user.id ?? session.user.email ?? "";
    const authorName = session.user.name ?? session.user.email ?? "Unknown";
    const authorEmail = session.user.email ?? "";

    const newArticle: StoredArticle = {
      slug,
      title,
      excerpt,
      coverImage,
      tags: normalizedTags,
      content,
      authorId,
      authorName,
      authorEmail,
      publishedAt,
      readingTime,
    };

    const updated = [...readArticles(), newArticle];
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

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const slug = url.searchParams.get("slug");
  if (!slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }

  const authorId = session.user.id ?? session.user.email ?? "";
  const existingArticles = readArticles();
  const article = existingArticles.find((item) => item.slug === slug);

  if (!article || article.authorId !== authorId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const updated = existingArticles.filter((item) => item.slug !== slug);
  writeArticles(updated);

  return NextResponse.json({ success: true }, { status: 200 });
}
