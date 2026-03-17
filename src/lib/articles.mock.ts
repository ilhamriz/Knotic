export type MockArticle = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  publishedAt: string;
  author: string;
  tags: string[];
  readingTime: string;
};

export const mockArticles: MockArticle[] = [
  {
    id: "1",
    title: "Introducing Knotic",
    slug: "introducing-knotic",
    excerpt:
      "Knotic is a modern knowledge platform built to help you organize ideas, publish content, and think more clearly.",
    content: `
Knotic was created with a simple goal: make knowledge easier to structure and share.

In a world filled with scattered notes and endless information, clarity becomes rare. Knotic focuses on helping users build structured thinking habits.

You can create articles, organize ideas with tags, and even enhance content with AI assistance.

This is not just a blogging platform — it's a thinking environment.
    `,
    publishedAt: "2026-01-01",
    author: "Ilham Rizky",
    tags: ["product", "announcement", "knowledge"],
    readingTime: "4 min read",
  },
  {
    id: "2",
    title: "Why Structured Thinking Matters",
    slug: "why-structured-thinking-matters",
    excerpt:
      "Information is everywhere. Structure is what turns it into long-term understanding.",
    content: `
We consume information every day — articles, videos, tutorials, threads.

But without structure, information fades quickly.

Structured thinking helps you:
- Retain knowledge longer
- Connect ideas across domains
- Make better decisions

Knotic encourages structured writing to transform passive consumption into active understanding.
    `,
    publishedAt: "2026-01-03",
    author: "Ilham Rizky",
    tags: ["thinking", "productivity", "learning"],
    readingTime: "5 min read",
  },
  {
    id: "3",
    title: "From Notes to Insights",
    slug: "from-notes-to-insights",
    excerpt:
      "Writing notes is easy. Transforming them into insights requires iteration and reflection.",
    content: `
Most people collect notes but never revisit them.

Insights are born from:
- Reviewing ideas
- Refining explanations
- Connecting related thoughts

Knotic makes it easy to revisit and evolve your content. With version-friendly structure and AI support, your notes grow with you.
    `,
    publishedAt: "2026-01-05",
    author: "Ilham Rizky",
    tags: ["writing", "insight", "growth"],
    readingTime: "6 min read",
  },
  {
    id: "4",
    title: "Designing a Modern Content Platform",
    slug: "designing-modern-content-platform",
    excerpt:
      "Building a content system today means balancing SEO, performance, accessibility, and user experience.",
    content: `
Modern content platforms must do more than just display text.

They must:
- Load fast
- Rank well on search engines
- Be accessible to all users
- Provide smooth editing experiences

Knotic is built with these principles in mind — combining modern frontend architecture with user-centered design.
    `,
    publishedAt: "2026-01-07",
    author: "Ilham Rizky",
    tags: ["architecture", "frontend", "design"],
    readingTime: "7 min read",
  },
  {
    id: "5",
    title: "The Role of AI in Writing",
    slug: "role-of-ai-in-writing",
    excerpt:
      "AI should assist thinking, not replace it. The future of writing is collaborative intelligence.",
    content: `
AI is transforming how we write and organize knowledge.

But AI is most powerful when it:
- Suggests improvements
- Summarizes long content
- Helps with clarity

Knotic integrates AI carefully — as a thinking assistant, not a thinking replacement.

The goal is to enhance human creativity, not automate it entirely.
    `,
    publishedAt: "2026-01-10",
    author: "Ilham Rizky",
    tags: ["ai", "writing", "future"],
    readingTime: "5 min read",
  },
];

