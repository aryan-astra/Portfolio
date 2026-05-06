import type { MetadataRoute } from "next";
import { projects, posts } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://aryans.is-a.dev";

  const projectRoutes = projects.map((project) => ({
    url: `${baseUrl}/projects/${project.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: project.featured ? 0.8 : 0.6,
  }));

  const postRoutes = posts.map((post) => ({
    url: `${baseUrl}/writing/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "yearly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/writing`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...projectRoutes,
    ...postRoutes,
  ];
}
