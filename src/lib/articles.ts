export type Article = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  publishedAt: string;
};

export const articles: Article[] = [
  {
    title: "Introducing Knotic",
    slug: "introducing-knotic",
    excerpt:
      "Knotic is a knowledge and writing platform designed to help you think, write, and organize ideas more clearly.",
    content: `
Knotic is built for people who love writing, learning, and organizing knowledge.

Unlike traditional note-taking tools, Knotic focuses on clarity, structure, and discoverability. 
You can write publicly or privately, organize your thoughts, and let AI help you summarize and refine your ideas.

This project is also a learning journey — built step by step with modern web technologies and best practices in mind.
    `,
    publishedAt: "2026-01-01",
  },
  {
    title: "Why Knowledge Needs Structure",
    slug: "why-knowledge-needs-structure",
    excerpt:
      "Collecting information is easy. Structuring knowledge so it remains useful over time is the real challenge.",
    content: `
We live in an age of endless information.

Articles, videos, tweets, and notes are everywhere. But without structure, knowledge becomes noise.
That’s why tools like Knotic emphasize organization, tagging, and context.

Structured knowledge helps you:
- Recall information faster
- Connect ideas more easily
- Build long-term understanding

Good tools don’t just store information — they help you think.
    `,
    publishedAt: "2026-01-03",
  },
  {
    title: "From Notes to Insight",
    slug: "from-notes-to-insight",
    excerpt:
      "Taking notes is only the first step. Turning those notes into insight requires reflection and iteration.",
    content: `
Most people stop at note-taking.

Insight comes from revisiting, refining, and connecting ideas over time.
Knotic encourages this by making content easy to edit, revisit, and enhance — including with AI assistance.

Your notes shouldn’t be static. They should evolve as your understanding grows.
    `,
    publishedAt: "2026-01-05",
  },
];
