/**
 * Shared, module-level mutable state for the SVG octopus pet.
 * `OctopusPet` writes into this every frame; `PetInteractive` reads from
 * it to drive heading-letter tilt. We deliberately avoid React state /
 * context here because both consumers update at 60 fps.
 */

export type Mood =
  | "idle"
  | "curious"
  | "flee"
  | "angry"
  | "playful"
  | "sleep";

export interface Tip {
  x: number;
  y: number;
}

export const petStore: {
  alive: boolean;
  /** Pet center in viewport coords. */
  petX: number;
  petY: number;
  mood: Mood;
  mouseX: number;
  mouseY: number;
  /** 8 tentacle-tip positions in viewport coords. */
  tips: Tip[];
} = {
  alive: false,
  petX: -9999,
  petY: -9999,
  mood: "idle",
  mouseX: -9999,
  mouseY: -9999,
  tips: Array.from({ length: 8 }, () => ({ x: -9999, y: -9999 })),
};
