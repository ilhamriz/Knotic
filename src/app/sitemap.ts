import { getAllArticles } from "@/lib/articles";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articleRoutes: MetadataRoute.Sitemap = [];

  try {
    const articles = await getAllArticles();
    articleRoutes.push(
      ...articles.map((article) => ({
        url: `https://knotic.vercel.app/articles/${article.slug}`,
        lastModified: article.publishedAt,
      })),
    );
  } catch (error) {
    console.warn(
      "Failed to fetch articles for sitemap. Database may not be available during build.",
      error,
    );
  }

  return [
    {
      url: "https://knotic.vercel.app",
      lastModified: new Date(),
    },
    {
      url: "https://knotic.vercel.app/articles",
      lastModified: new Date(),
    },
    ...articleRoutes,
  ];
}
