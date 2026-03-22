import { getAllArticles } from "@/lib/articles";

export default function sitemap() {
  const articleRoutes = getAllArticles().map((article) => ({
    url: `https://knotic.vercel.app/articles/${article.slug}`,
    lastModified: article.publishedAt,
  }));

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
