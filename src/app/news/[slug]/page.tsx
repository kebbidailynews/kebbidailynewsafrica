// src/app/news/[slug]/page.tsx

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { notFound } from 'next/navigation';
import React from 'react';
import { marked } from 'marked'; // or use remark + remark-html if preferred

export default function NewsPost({ params }: { params: { slug: string } }) {
  const filePath = path.join(process.cwd(), 'content/news', `${params.slug}.md`);

  if (!fs.existsSync(filePath)) {
    notFound();
  }

  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);
  const htmlContent = marked(content); // Markdown to HTML

  return (
    <article className="prose lg:prose-xl p-4">
      <h1>{data.title}</h1>
      <p className="text-gray-500">{new Date(data.date).toLocaleDateString()}</p>
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </article>
  );
}
