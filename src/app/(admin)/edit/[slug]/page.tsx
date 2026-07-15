import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getArticleBySlug } from "@/lib/articles";
import { redirect } from "next/navigation";
import EditForm from "./EditForm";

interface EditPageProps {
  params: Promise<{ slug: string }>;
}

export default async function EditPage({ params }: EditPageProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article || article.authorId !== session.user.id) {
    redirect("/dashboard");
  }

  return <EditForm article={article} />;
}
