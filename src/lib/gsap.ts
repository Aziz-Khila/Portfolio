"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { motionMode } from "./motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
  gsap.defaults({ ease: "expo.out", duration: 1.2 });}

export function prefersReducedMotion() {
  return motionMode.get() === "reduced";
}

/** A gsap.matchMedia condition that never matches while animations are switched off. */
export function whenMotion(query = "all") {
  return prefersReducedMotion() ? "not all" : query;
}

export { gsap, ScrollTrigger, SplitText, useGSAP };
