import { getAllArticles, type ArticlePreview } from "@/lib/articles";
import SearchClient from "./SearchClient";

export default async function SearchPage() {
  let allArticles: ArticlePreview[] = [];

  try {
    allArticles = await getAllArticles();
  } catch (error) {
    console.warn(
      "Failed to fetch articles for search page. Database may not be available during build.",
      error,
    );
  }

  return <SearchClient articles={allArticles} />;
}
