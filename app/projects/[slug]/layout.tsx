import { DynamicIslandTOC } from "@/components/DynamicIslandTOC";

export default function ProjectSlugLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DynamicIslandTOC>{children}</DynamicIslandTOC>;
}
