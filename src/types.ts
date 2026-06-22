export interface InteractiveElement {
  label: string;
  emoji: string;
  soundType: "croak" | "honk" | "boing" | "chime" | "squeak" | "robot" | "twinkle";
  animation: "bounce" | "spin" | "pulse" | "tilt" | "wiggle";
}

export interface Page {
  pageNumber: number;
  text: string;
  illustrationPrompt: string;
  imageUrl?: string;
  audioUrl?: string; // Cache local blob url
  interactiveElements?: InteractiveElement[];
}

export interface Story {
  title: string;
  pages: Page[];
}

export interface Message {
  id: string;
  role: "user" | "model";
  text: string;
  timestamp: string;
}

export interface Buddy {
  id: "elf" | "owl" | "pixie";
  name: string;
  role: string;
  avatar: string;
  model: string;
  description: string;
  color: string;
  placeholder: string;
}

export type VoiceName = "Kore" | "Puck" | "Charon" | "Fenrir" | "Zephyr";

export interface VoiceOption {
  value: VoiceName;
  label: string;
  description: string;
}

export interface ParentSettings {
  dailyMinLimit: number; // Daily reading limit in minutes (0 means none/unlimited)
  filterThemes: string[]; // Allowed themes ("space", "forest", etc.)
  maxComplexity: "easy" | "medium" | "hard" | "all"; // Limit book vocabulary
  statsDailyMinutes: Record<string, number>; // Date (e.g., "2026-06-22") -> minutes read
  passcode: string; // Master parent code (default "1234")
}

export interface HistoryItem {
  id: string;
  title: string;
  characterName: string;
  themeId: string;
  timestamp: string;
  pagesCount: number;
}

