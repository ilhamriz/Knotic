export const formatArticlePublishedDate = (publishedAt: string) => {
  const date = new Date(publishedAt);

  // Use Indonesian locale for display
  return date.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
