import { DynamicIslandTOC } from "@/components/DynamicIslandTOC";

export default function WritingSlugLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DynamicIslandTOC headingSelector="article section[data-toc-label]">{children}</DynamicIslandTOC>;
}
