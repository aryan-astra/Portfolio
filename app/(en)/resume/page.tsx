import MobileResumeDoc from "@/components/resume/MobileResumeDoc";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Résumé", description: "Aryan Shukla — education, projects, skills, and a printable résumé.", alternates: { canonical: "/resume", languages: { en: "/resume", ru: "/ru/resume" } } };

/**
 * Resume page — single unified view across mobile, tablet and desktop.
 * The previous 3D typewriter scene was retired in favour of the simpler
 * "type-in LaTeX → rendered resume" flow that already worked on mobile.
 */
export default function ResumePage() {
  return <MobileResumeDoc />;
}
