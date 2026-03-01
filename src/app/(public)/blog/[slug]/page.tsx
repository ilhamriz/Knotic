import { articles } from "@/lib/articles";
import { getArticleBySlug } from "@/lib/utils";
import { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

const ArticlePage = async ({ params }: Props) => {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }
  return (
    <article className="max-w-3xl mx-auto py-12 space-y-6">
      <header>
        <h1 className="text-3xl font-bold">{article.title}</h1>
        <p className="text-gray-500">{article.excerpt}</p>
      </header>

      <section className="prose">
        <p>{article.content}</p>
      </section>
    </article>
  );
};

export async function generateStaticParams() {
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // read route params
  const { slug } = await params;

  // fetch data
  const article = getArticleBySlug(slug);

  if (!article) {
    return {
      title: "Article Not Found | Knotic",
      description: "Article not found",
    };
  }

  return {
    title: article?.title,
    description: article?.excerpt,
  };
}

export default ArticlePage;
