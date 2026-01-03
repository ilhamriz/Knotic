import { articles } from "@/lib/articles";
import { Metadata } from "next";
import Link from "next/link";

export default function BlogPage() {
  const listArticles = articles;
  return (
    <section>
      <h2 className="hidden">Blog</h2>
      <div className="flex flex-wrap gap-4 px-4 md:px-10">
        {listArticles.map((article) => (
          // TODO: NEXT TIME EDIT STYLE FLEX WITH W-1/2 OR W-1/3
          <article
            key={article.slug}
            className="bg-gray-900 p-4 rounded-md"
            style={{ flex: "0 0 calc(100%/4)" }}
          >
            <h3>{article.title}</h3>
            <p>{article.excerpt}</p>
            <Link href={`/blog/${article.slug}`} className="text-blue-500">
              Read more
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}

export const metadata: Metadata = {
  title: "Knotic - Blog",
  description: "Blog of Knotic",
};
