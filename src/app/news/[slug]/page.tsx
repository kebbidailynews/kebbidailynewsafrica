// src/app/news/[slug]/page.tsx

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { notFound } from 'next/navigation';
import React from 'react';
import { marked } from 'marked';

export default async function NewsPost({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const filePath = path.join(process.cwd(), 'content/news', `${slug}.md`);

  // Use fs.promises to keep it fully async (recommended)
  try {
    const fileContents = await fs.promises.readFile(filePath, 'utf8');
    const { data, content } = matter(fileContents);
    const htmlContent = marked(content);

    return (
      <article className="prose lg:prose-xl p-4">
        <h1>{data.title}</h1>
        <p className="text-gray-500">{new Date(data.date).toLocaleDateString()}</p>
        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
      </article>
    );
  } catch (err) {
    notFound();
  }
}
