import { getAllArticles } from "@/lib/articles";
import SearchClient from "./SearchClient";

export default function SearchPage() {
  const allArticles = getAllArticles();

  return <SearchClient articles={allArticles} />;
}
