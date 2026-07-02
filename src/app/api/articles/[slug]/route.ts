import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { NextResponse, NextRequest } from "next/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { slug } = await params;
    const body = await request.json();
    const { title, excerpt, coverImage, tags, content } = body as {
      title: string;
      excerpt: string;
      coverImage: string;
      tags: string;
      content: string;
    };

    // Find the article
    const article = await prisma.article.findUnique({
      where: { slug },
    });

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    // Check authorization
    if (article.authorId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Recalculate reading time
    const words = content.trim().split(/\s+/).filter(Boolean).length;
    const readingTime = Math.max(1, Math.ceil(words / 200));

    // Parse tags
    const parsedTags = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    // Update the article (slug stays immutable)
    const updated = await prisma.article.update({
      where: { slug },
      data: {
        title,
        excerpt,
        coverImage,
        tags: parsedTags,
        content,
        readingTime,
      },
    });

    return NextResponse.json({ article: updated }, { status: 200 });
  } catch (error) {
    console.error("Failed to update article", error);
    return NextResponse.json(
      { error: "Could not update article" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { slug } = await params;

    // Find the article
    const article = await prisma.article.findUnique({
      where: { slug },
    });

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    // Check authorization
    if (article.authorId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Delete the article
    await prisma.article.delete({
      where: { slug },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Failed to delete article", error);
    return NextResponse.json(
      { error: "Could not delete article" },
      { status: 500 },
    );
  }
}
