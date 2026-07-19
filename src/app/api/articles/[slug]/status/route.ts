// app/api/articles/[slug]/status/route.ts

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { revalidatePath } from "next/cache";
import { NextResponse, NextRequest } from "next/server";

export async function PATCH(
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
    const { status } = body as { status: unknown };

    if (status !== "draft" && status !== "published") {
      return NextResponse.json(
        { error: "Invalid status. Must be 'draft' or 'published'." },
        { status: 400 },
      );
    }

    const article = await prisma.article.findUnique({
      where: { slug },
    });

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    if (article.authorId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updated = await prisma.article.update({
      where: { slug },
      data: { status },
    });

    revalidatePath("/");
    revalidatePath("/articles");
    revalidatePath(`/articles/${slug}`);
    revalidatePath("/tags", "layout");

    return NextResponse.json({ article: updated }, { status: 200 });
  } catch (error) {
    console.error("Failed to update article status", error);
    return NextResponse.json(
      { error: "Could not update article status" },
      { status: 500 },
    );
  }
}
