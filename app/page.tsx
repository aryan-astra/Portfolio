"use client";

import dynamic from "next/dynamic";
import Hero from "@/components/sections/Hero";

const Projects = dynamic(() => import("@/components/sections/Projects"));
const Writing = dynamic(() => import("@/components/sections/Writing"));
const Hackathons = dynamic(() => import("@/components/sections/Hackathons"));
const Contact = dynamic(() => import("@/components/sections/Contact"));

export default function Home() {
  return (
    <div className="relative z-10">
      <Hero />
      <Projects />
      <Writing />
      <Hackathons />
      <Contact />
    </div>
  );
}
