import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getUserArticles } from "@/lib/articles";
import { redirect } from "next/navigation";
import { buildMetadata } from "@/lib/metadata";
import DashboardClient from "./DashboardClient";

export const metadata = buildMetadata(
  "Dashboard",
  "Manage your articles on Knotic.",
);

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  const authorId = session.user.id ?? session.user.email ?? "";
  const articles = await getUserArticles(authorId);

  return <DashboardClient articles={articles} />;
}
