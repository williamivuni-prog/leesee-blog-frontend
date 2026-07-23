"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

import { createPost, deletePost, fetchPosts, updatePost } from "@/lib/api";
import { formatDate } from "@/lib/format";
import type { Post, PostInput } from "@/types/post";

const emptyForm: PostInput = {
  title: "",
  excerpt: "",
  content: "",
  author: "",
};

export function BlogManager() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string>("");
  const [form, setForm] = useState<PostInput>(emptyForm);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string>("");

  const selectedPost = useMemo(
    () => posts.find((post) => post.slug === selectedSlug) || posts[0],
    [posts, selectedSlug],
  );

  async function loadPosts() {
    setIsLoading(true);
    setError("");
    try {
      const data = await fetchPosts();
      setPosts(data);
      if (!selectedSlug && data[0]) {
        setSelectedSlug(data[0].slug);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load posts");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadPosts();
  }, []);

  function startCreate() {
    setForm(emptyForm);
    setIsEditing(false);
  }

  function startEdit(post: Post) {
    setForm({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      author: post.author,
    });
    setIsEditing(true);
    setSelectedSlug(post.slug);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setError("");

    try {
      const saved = isEditing && selectedPost ? await updatePost(selectedPost.slug, form) : await createPost(form);
      await loadPosts();
      setSelectedSlug(saved.slug);
      setForm(emptyForm);
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save post");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(post: Post) {
    setIsSaving(true);
    setError("");
    try {
      await deletePost(post.slug);
      setSelectedSlug("");
      await loadPosts();
      if (isEditing && selectedSlug === post.slug) {
        startCreate();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete post");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <main className="mx-auto grid min-h-screen w-full max-w-7xl gap-6 px-5 py-6 lg:grid-cols-[340px_1fr] lg:px-8">
      <aside className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="font-mono text-xs uppercase tracking-wide text-[var(--accent)]">Fullstack demo</p>
            <h1 className="mt-1 text-2xl font-semibold text-[var(--ink)]">Leesee Blog</h1>
          </div>
          <button
            className="rounded-md bg-[var(--accent)] px-3 py-2 text-sm font-medium text-white hover:bg-[var(--accent-dark)]"
            onClick={startCreate}
            type="button"
          >
            New
          </button>
        </div>

        {isLoading ? (
          <p className="rounded-md border border-dashed border-[var(--border)] p-4 text-sm text-[var(--muted)]">
            Loading posts...
          </p>
        ) : posts.length === 0 ? (
          <p className="rounded-md border border-dashed border-[var(--border)] p-4 text-sm text-[var(--muted)]">
            No posts yet. Create the first article.
          </p>
        ) : (
          <div className="space-y-2">
            {posts.map((post) => (
              <button
                className={`w-full rounded-md border p-3 text-left transition ${
                  selectedPost?.slug === post.slug
                    ? "border-[var(--accent)] bg-teal-50"
                    : "border-[var(--border)] bg-white hover:border-[var(--accent)]"
                }`}
                key={post.id}
                onClick={() => setSelectedSlug(post.slug)}
                type="button"
              >
                <span className="block text-sm font-semibold text-[var(--ink)]">{post.title}</span>
                <span className="mt-1 block text-xs text-[var(--muted)]">{post.author}</span>
              </button>
            ))}
          </div>
        )}
      </aside>

      <section className="grid gap-6 xl:grid-cols-[1fr_400px]">
        <article className="min-h-[520px] rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
          {selectedPost ? (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] pb-4">
                <div>
                  <p className="font-mono text-xs text-[var(--muted)]">
                    {formatDate(selectedPost.created_at)} by {selectedPost.author}
                  </p>
                  <h2 className="mt-2 text-3xl font-semibold leading-tight text-[var(--ink)]">{selectedPost.title}</h2>
                </div>
                <div className="flex gap-2">
                  <button
                    className="rounded-md border border-[var(--border)] px-3 py-2 text-sm font-medium hover:border-[var(--accent)]"
                    onClick={() => startEdit(selectedPost)}
                    type="button"
                  >
                    Edit
                  </button>
                  <button
                    className="rounded-md border border-red-200 px-3 py-2 text-sm font-medium text-[var(--danger)] hover:bg-red-50"
                    disabled={isSaving}
                    onClick={() => void handleDelete(selectedPost)}
                    type="button"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <p className="mt-6 text-lg leading-8 text-[var(--muted)]">{selectedPost.excerpt}</p>
              <div className="mt-6 whitespace-pre-line text-base leading-8 text-[var(--foreground)]">
                {selectedPost.content}
              </div>
            </>
          ) : (
            <div className="flex h-full items-center justify-center rounded-md border border-dashed border-[var(--border)] text-[var(--muted)]">
              Select or create a post.
            </div>
          )}
        </article>

        <form className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm" onSubmit={handleSubmit}>
          <div className="mb-4">
            <p className="font-mono text-xs uppercase tracking-wide text-[var(--accent)]">
              {isEditing ? "Edit post" : "Create post"}
            </p>
            <h3 className="mt-1 text-xl font-semibold text-[var(--ink)]">Editor</h3>
          </div>

          {error ? (
            <p className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-[var(--danger)]">{error}</p>
          ) : null}

          <label className="mb-3 block text-sm font-medium">
            Title
            <input
              className="mt-1 w-full rounded-md border border-[var(--border)] px-3 py-2 outline-none focus:border-[var(--accent)]"
              onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
              required
              value={form.title}
            />
          </label>

          <label className="mb-3 block text-sm font-medium">
            Author
            <input
              className="mt-1 w-full rounded-md border border-[var(--border)] px-3 py-2 outline-none focus:border-[var(--accent)]"
              onChange={(event) => setForm((current) => ({ ...current, author: event.target.value }))}
              required
              value={form.author}
            />
          </label>

          <label className="mb-3 block text-sm font-medium">
            Excerpt
            <textarea
              className="mt-1 min-h-24 w-full resize-y rounded-md border border-[var(--border)] px-3 py-2 outline-none focus:border-[var(--accent)]"
              onChange={(event) => setForm((current) => ({ ...current, excerpt: event.target.value }))}
              required
              value={form.excerpt}
            />
          </label>

          <label className="mb-4 block text-sm font-medium">
            Content
            <textarea
              className="mt-1 min-h-44 w-full resize-y rounded-md border border-[var(--border)] px-3 py-2 outline-none focus:border-[var(--accent)]"
              onChange={(event) => setForm((current) => ({ ...current, content: event.target.value }))}
              required
              value={form.content}
            />
          </label>

          <div className="flex gap-2">
            <button
              className="rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--accent-dark)]"
              disabled={isSaving}
              type="submit"
            >
              {isSaving ? "Saving..." : isEditing ? "Update" : "Publish"}
            </button>
            <button
              className="rounded-md border border-[var(--border)] px-4 py-2 text-sm font-semibold"
              onClick={startCreate}
              type="button"
            >
              Clear
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
