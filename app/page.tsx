"use client";

import dynamic from "next/dynamic";
import Hero from "@/components/sections/Hero";

const FeaturedWork = dynamic(() => import("@/components/sections/FeaturedWork"));
const Projects = dynamic(() => import("@/components/sections/Projects"));
const Skills = dynamic(() => import("@/components/sections/Skills"));
const Hackathons = dynamic(() => import("@/components/sections/Hackathons"));
const Contact = dynamic(() => import("@/components/sections/Contact"));

export default function Home() {
  return (
    <div className="relative z-10">
      <Hero />
      <FeaturedWork />
      <Projects />
      <Skills />
      <Hackathons />
      <Contact />
    </div>
  );
}
