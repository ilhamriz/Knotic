export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export function buildMetadata(title: string, description: string) {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      siteName: "Knotic",
    },
    twitter: {
      title,
      description,
    },
  };
}
