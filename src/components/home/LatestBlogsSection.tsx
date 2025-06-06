// components/LatestBlogsSection.tsx
'use client';

import Link from 'next/link';
import BlogCard from "@/components/blogs/blog-card";
import type { Blog } from "@/types"

interface LatestBlogsSectionProps {
  blogs: Blog[];
}

const LatestBlogsSection = ({ blogs }: LatestBlogsSectionProps) => {
  return (
    <section className="py-20 text-craterbrown">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-craterbrown mb-6 tracking-tight">
            Explore Our Latest Blogs
          </h2>
          <p className="text-xl text-craterbrown-300 max-w-2xl mx-auto leading-relaxed">
            Stay updated with expert insights, tips, and real estate trends to guide your property journey.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {blogs.map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
         ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/blogs">
            <button className="px-8 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-lg transform transition-transform duration-300 hover:scale-105">
              View All Blogs
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LatestBlogsSection;
