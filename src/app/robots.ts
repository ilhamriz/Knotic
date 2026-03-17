export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://knotic.vercel.app/sitemap.xml",
  };
}
