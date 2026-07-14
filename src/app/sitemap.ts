import { getAllArticles } from "@/lib/articles";
import { siteUrl } from "@/lib/metadata";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articleRoutes: MetadataRoute.Sitemap = [];

  try {
    const articles = await getAllArticles();
    articleRoutes.push(
      ...articles.map((article) => ({
        url: `${siteUrl}/articles/${article.slug}`,
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
      url: siteUrl,
      lastModified: new Date(),
    },
    {
      url: `${siteUrl}/articles`,
      lastModified: new Date(),
    },
    ...articleRoutes,
  ];
}
