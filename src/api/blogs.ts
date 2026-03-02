// src/api/blogs.ts
import apiClient from "./apiClient";

export interface BlogPayload {
  title: string;
  slug: string;
  content: string;
  read_time: number;
  excerpt?: string;
  is_published?: boolean;
  tags?: string[]; // UUIDs
}

export interface Tag {
  id: string;
  name: string;
}

export interface BlogResponse {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  is_published?: boolean;
  read_time: number;
  tags: Tag[];
  published_at?: string;
}

export const createBlog = async (data: BlogPayload) => {
  const response = await apiClient.post("/api/blogs/posts/", data);
  return response.data;
};

export const fetchBlogs = async (): Promise<BlogResponse[]> => {
  const response = await apiClient.get("/api/blogs/posts/");
  const blogs = response.data;

  return blogs.map((blog: any) => ({
    ...blog,
    tags: (blog.tags || []).map((tag: any) =>
      typeof tag === "string" ? { id: tag, name: tag } : tag
    ),
  }));
};
