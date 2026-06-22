import { Buddy, VoiceOption } from "./types";

export const STYLES = {
  STORY_BG: "bg-radial from-amber-50 to-orange-100",
  TEXT_COLOR: "text-zinc-800",
};

export interface StoryTheme {
  id: string;
  title: string;
  icon: string;
  setting: string;
  defaultCharacter: string;
  color: string;
  description: string;
  extraPromptSuggestion: string;
}

export const STORY_THEMES: StoryTheme[] = [
  {
    id: "space",
    title: "Magical Space Voyage",
    icon: "Rocket",
    setting: "A warm and sparkly neon solar system with candy planets and shooting star-slides.",
    defaultCharacter: "Cosmo the Bubble-suit Bunny",
    color: "from-blue-500 to-indigo-600",
    description: "Explore marshmallow asteroids and bouncy moon trampolines!",
    extraPromptSuggestion: "searching for the missing strawberry milk galaxy",
  },
  {
    id: "forest",
    title: "Magical Fairy Forest",
    icon: "Trees",
    setting: "An enchanted wood colored in pastel pink sand, glowing lantern-flowers, and talking mushrooms.",
    defaultCharacter: "Willa the Whispering Woodmouse",
    color: "from-emerald-400 to-teal-600",
    description: "Discover treehouse slides and giant bubble-blowing tea parties!",
    extraPromptSuggestion: "organizing an annual raspberry cupcake party for fireflies",
  },
  {
    id: "ocean",
    title: "Sparkly Deep Sea coral",
    icon: "Waves",
    setting: "An underwater castle made of glowing sea glass and friendly giggling octopuses.",
    defaultCharacter: "Barnaby the Balloon Seahorse",
    color: "from-cyan-400 to-blue-500",
    description: "Sing along with underwater coral bands and find treasure boxes of golden gummy bears!",
    extraPromptSuggestion: "helping a baby whale who lost his shiny blue seashell",
  },
  {
    id: "dinosaurs",
    title: "Bubble Dinosaur Valley",
    icon: "Egg",
    setting: "A high-up friendly jungle where tiny colorful dinosaurs eat cloud cotton candy.",
    defaultCharacter: "Pip the polka-dotted Triceratops",
    color: "from-amber-400 to-amber-600",
    description: "Play hide-and-seek behind giant soft ferns and slide down soapy bubble geysers!",
    extraPromptSuggestion: "discovering a giant magical rainbow strawberry",
  },
  {
    id: "bedtime",
    title: "Starry Sleepy Cabin",
    icon: "Sparkles",
    setting: "A cozy log cottage surrounded by floating fluffy clouds and gentle starry night sleep-winds.",
    defaultCharacter: "Luna the Sleepy PJ Bear",
    color: "from-purple-500 to-indigo-700",
    description: "Count soft jumping sheep, snuggle with plush toy companions, and listen to owl lullabies.",
    extraPromptSuggestion: "finding the legendary blanket that generates warm starry light dreams",
  },
];

export const VOICE_OPTIONS: VoiceOption[] = [
  {
    value: "Kore",
    label: "Kore (Warm & Sweet)",
    description: "A soft, maternal, and calming storytelling voice.",
  },
  {
    value: "Puck",
    label: "Puck (Cheerful & Bright)",
    description: "A playful, exciting, and high-spirited narration.",
  },
  {
    value: "Charon",
    label: "Charon (Calming & Soft)",
    description: "Gentle, slower, and perfect for bedtime winding down.",
  },
  {
    value: "Fenrir",
    label: "Fenrir (Playful & Energetic)",
    description: "Fun, friendly, and very engaging for active stories.",
  },
  {
    value: "Zephyr",
    label: "Zephyr (Gentle & Wise)",
    description: "Deep, comfortable, and reassuring narrator tone.",
  },
];

export const BUDDIES: Buddy[] = [
  {
    id: "elf",
    name: "Elfie the Story-Elf",
    role: "General helper & Story brainstorms",
    avatar: "🧝‍♀️",
    model: "gemini-3.5-flash",
    description: "Enthusiastic and creative! Elfie can write cute poems, invent funny characters, and play magical guessing games.",
    color: "bg-emerald-100 text-emerald-800 border-emerald-300 ring-emerald-500",
    placeholder: "Hi friend! Want to brainstorm a funny character or add interactive games? Let's talk! ✨",
  },
  {
    id: "owl",
    name: "Professor Barnaby",
    role: "Big questions & Hard word solver",
    avatar: "🦉",
    model: "gemini-3.1-pro-preview",
    description: "Uses a wise model to explain difficult vocabulary, share real-world science or historical facts, or decode story morals.",
    color: "bg-indigo-100 text-indigo-800 border-indigo-300 ring-indigo-500",
    placeholder: "Greetings, young scholar! Ask me any hard questions about big words, nature, or science. Hoot! 🦉",
  },
  {
    id: "pixie",
    name: "Pip the Speedy Dragon",
    role: "Speedy responses & Emoji games",
    avatar: "🦖",
    model: "gemini-3.1-flash-lite",
    description: "Loads instantly! Pip speaks in fast, short chirpy bursts, loves telling silly jokes, and casts emoji bubble spells.",
    color: "bg-amber-100 text-amber-800 border-amber-300 ring-amber-500",
    placeholder: "Squeak! Squeeeeak! Ask me a fast question, I will answer super fast with lots of emojis! 🦖🔥",
  },
];
