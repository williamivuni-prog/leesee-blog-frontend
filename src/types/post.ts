export type Post = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  created_at: string;
  updated_at: string;
};

export type PostInput = Pick<Post, "title" | "excerpt" | "content" | "author">;
