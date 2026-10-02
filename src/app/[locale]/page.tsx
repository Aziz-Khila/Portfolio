import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { StackMarquee } from "@/components/sections/StackMarquee";
import { Work } from "@/components/sections/Work";
import { Path } from "@/components/sections/Path";
import { Skills } from "@/components/sections/Skills";
import { Resume } from "@/components/sections/Resume";
import { Contact } from "@/components/sections/Contact";

export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <StackMarquee />
      <Work />
      <Path />
      <Skills />
      <Resume />
      <Contact />
    </>
  );
}
