import { articles } from "./articles";

export const getArticleBySlug = (slug: string) =>
  articles.find((article) => article?.slug === slug);
