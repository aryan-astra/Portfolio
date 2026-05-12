import MobileResumeDoc from "@/components/resume/MobileResumeDoc";

/**
 * Resume page — single unified view across mobile, tablet and desktop.
 * The previous 3D typewriter scene was retired in favour of the simpler
 * "type-in LaTeX → rendered resume" flow that already worked on mobile.
 */
export default function ResumePage() {
  return <MobileResumeDoc />;
}
