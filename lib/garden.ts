import { posts, projects } from "@/lib/data";
import { concepts } from "@/lib/concepts";
import { linkConcepts } from "@/lib/linking";
import { notes, noteText } from "@/lib/notes";

export { concepts } from "@/lib/concepts";
export type GardenItem = { id: string; title: string; href: string; type: "post" | "project" | "concept"; excerpt: string; tags: string[] };

const sources: { item: GardenItem; text: string[] }[] = [
  ...posts.map(post => ({ item: { id: `post:${post.slug}`, title: post.title, href: `/writing/${post.slug}`, type: "post" as const, excerpt: post.description, tags: [] }, text: post.body })),
  ...projects.map(project => ({ item: { id: `project:${project.slug}`, title: project.name, href: `/projects/${project.slug}`, type: "project" as const, excerpt: project.oneLiner, tags: project.tags }, text: [project.caseStudy.problem, project.caseStudy.approach, project.caseStudy.outcome, ...project.caseStudy.keyDecisions] })),
  ...notes.filter(note => note.language === "en").map(note => ({ item: { id: `note:${note.id}`, title: note.title, href: `/notes/${note.slug}`, type: "post" as const, excerpt: note.excerpt, tags: note.tags }, text: [noteText(note)] })),
];

export const gardenItems: GardenItem[] = [...sources.map(source => source.item), ...concepts.map(concept => ({ id: `concept:${concept.id}`, title: concept.title, href: `/garden/${concept.id}`, type: "concept" as const, excerpt: "A topic index linking to the writing and projects that mention it.", tags: [] }))];

export function conceptSources(id: string) {
  const concept = concepts.find(item => item.id === id);
  if (!concept) return undefined;
  return { concept, sources: sources.filter(source => source.text.some(text => linkConcepts(text).some(part => part.href === `/garden/${id}`))).map(source => source.item) };
}

export function itemRelations(id: string) {
  if (id.startsWith("concept:")) return conceptSources(id.slice(8))?.sources ?? [];
  return concepts.filter(concept => conceptSources(concept.id)?.sources.some(source => source.id === id))
    .map(concept => gardenItems.find(item => item.id === `concept:${concept.id}`)!);
}
