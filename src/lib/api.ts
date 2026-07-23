import type { Post, PostInput } from "@/types/post";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || `Request failed with status ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export async function fetchPosts(): Promise<Post[]> {
  const data = await request<{ posts: Post[] }>("/api/posts");
  return data.posts;
}

export async function createPost(input: PostInput): Promise<Post> {
  return request<Post>("/api/posts", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function updatePost(slug: string, input: Partial<PostInput>): Promise<Post> {
  return request<Post>(`/api/posts/${slug}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
}

export async function deletePost(slug: string): Promise<void> {
  await request<void>(`/api/posts/${slug}`, { method: "DELETE" });
}
