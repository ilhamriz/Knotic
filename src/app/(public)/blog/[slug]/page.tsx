import { articles } from "@/lib/articles";
import { getArticleBySlug } from "@/lib/utils";
import { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

const ArticlePage = async ({ params }: Props) => {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article?.title) {
    notFound();
  }
  return (
    <div className="flex flex-col">
      <div className="">{article?.title}</div>
      <div className="">{article?.excerpt}</div>
      <div className="">{article?.content}</div>
    </div>
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

  return {
    title: article?.title,
    description: article?.excerpt,
  };
}

export default ArticlePage;
