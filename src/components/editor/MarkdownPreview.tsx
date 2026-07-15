"use client";

import { useEffect, useState } from "react";
import { remark } from "remark";
import remarkRehype from "remark-rehype";
import rehypeHighlight from "rehype-highlight";
import rehypeStringify from "rehype-stringify";

export default function MarkdownPreview({ content }: { content: string }) {
  const [html, setHtml] = useState("");

  useEffect(() => {
    let cancelled = false;

    remark()
      .use(remarkRehype)
      .use(rehypeHighlight)
      .use(rehypeStringify)
      .process(content)
      .then((result) => {
        if (!cancelled) setHtml(String(result));
      });

    return () => {
      cancelled = true;
    };
  }, [content]);

  return (
    <div
      className="prose prose-invert max-w-none prose-pre:bg-bg-surface prose-pre:border prose-pre:border-border-default"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
