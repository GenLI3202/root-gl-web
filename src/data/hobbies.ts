import type { HandIconName } from "@/components/hand-icons";

/** Hobby sub-pages under /hobbies/, in display order */
export type HobbyId = "cycling" | "reading" | "guitar";

export interface HobbyLink {
  id: HobbyId;
  icon: HandIconName;
}

export const HOBBIES: HobbyLink[] = [
  { id: "cycling", icon: "bike" },
  { id: "reading", icon: "book" },
  { id: "guitar", icon: "guitar" },
];
