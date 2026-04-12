import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getUserArticles } from "@/lib/articles";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  const authorId = session.user.id ?? session.user.email ?? "";
  const articles = getUserArticles(authorId);

  return <DashboardClient articles={articles} />;
}
