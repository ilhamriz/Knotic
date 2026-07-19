// app/api/articles/route.ts

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

function makeSlug(title: string) {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+$|-+$/g, "");
}

function calculateReadingTime(text: string) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const wordsPerMinute = 200;
  const minutes = Math.max(1, Math.ceil(words / wordsPerMinute));
  return minutes;
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      title,
      excerpt,
      coverImage,
      tags,
      content,
      status = "draft",
    } = body;

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

    // Validation cover image URL
    try {
      new URL(coverImage);
    } catch {
      return NextResponse.json(
        { error: "coverImage must be a valid URL" },
        { status: 400 },
      );
    }

    if (status !== "draft" && status !== "published") {
      return NextResponse.json(
        { error: "Invalid status. Must be 'draft' or 'published'." },
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
    const readingTime = calculateReadingTime(content);

    // Ensure slug uniqueness
    let slug = slugBase;
    let counter = 1;
    let slugExists = true;
    while (slugExists) {
      const existing = await prisma.article.findUnique({
        where: { slug },
      });
      if (!existing) {
        slugExists = false;
      } else {
        slug = `${slugBase}-${counter}`;
        counter += 1;
      }
    }

    const newArticle = await prisma.article.create({
      data: {
        title,
        excerpt,
        content,
        coverImage,
        tags: normalizedTags,
        slug,
        readingTime,
        status,
        authorId: session.user.id,
      },
      include: {
        author: true,
      },
    });

    revalidatePath("/");
    revalidatePath("/articles");
    revalidatePath("/tags", "layout");

    return NextResponse.json({ article: newArticle }, { status: 201 });
  } catch (error) {
    console.error("Failed to create article", error);
    return NextResponse.json(
      { error: "Could not create article" },
      { status: 500 },
    );
  }
}
