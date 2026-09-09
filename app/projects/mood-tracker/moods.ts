export type MoodId =
  | "freaking-out"
  | "sad"
  | "anxious"
  | "tired"
  | "meh"
  | "content"
  | "happy"
  | "excited"
  | "overjoyed"
  | "angry";

export type Mood = {
  id: MoodId;
  label: string;
  background: string;
  menu: string;
  date: string;
  fade: string;
  knob: string;
  preview: string;
  loopMs: number;
};

export const MOODS: Mood[] = [
  {
    id: "freaking-out",
    label: "Freaking Out",
    background: "#0a1c42",
    menu: "#06122d",
    date: "#82b2ff",
    fade: "linear-gradient(to bottom, rgba(30,47,103,0) 0%, #081535 100%)",
    knob: "#0b2c69",
    preview: "/projects/mood-tracker/previews/freaking-out.png",
    loopMs: 4200,
  },
  {
    id: "sad",
    label: "Sad",
    background: "linear-gradient(to bottom, #0d336f 0%, #0c2e5e 26%, #09295a 100%)",
    menu: "#072653",
    date: "#6392d4",
    fade: "linear-gradient(to bottom, rgba(18,79,152,0) 0%, #0c2e61 100%)",
    knob: "#6392d4",
    preview: "/projects/mood-tracker/previews/sad.png",
    loopMs: 4000,
  },
  {
    id: "anxious",
    label: "Anxious",
    background: "#133b45",
    menu: "#052129",
    date: "#63838d",
    fade: "linear-gradient(to bottom, rgba(36,85,98,0) 0%, #113540 100%)",
    knob: "#2b6977",
    preview: "/projects/mood-tracker/previews/anxious.png",
    loopMs: 4000,
  },
  {
    id: "tired",
    label: "Tired",
    background: "#35354d",
    menu: "#171928",
    date: "#979799",
    fade: "linear-gradient(to bottom, rgba(85,83,111,0) 0%, #292a3e 100%)",
    knob: "#c4c2e0",
    preview: "/projects/mood-tracker/previews/tired.png",
    loopMs: 4800,
  },
  {
    id: "meh",
    label: "Meh",
    background: "#494e55",
    menu: "#0a0a0a",
    date: "#6e7d90",
    fade: "linear-gradient(to bottom, rgba(57,58,58,0) 0%, #2a3036 100%)",
    knob: "#9aa4b0",
    preview: "/projects/mood-tracker/previews/meh.png",
    loopMs: 4800,
  },
  {
    id: "content",
    label: "Content",
    background: "#5d8961",
    menu: "#3e5c40",
    date: "#a8dcb4",
    fade: "linear-gradient(to bottom, rgba(93,137,97,0) 0%, #3e5c40 100%)",
    knob: "#d4f0c8",
    preview: "/projects/mood-tracker/previews/content.png",
    loopMs: 9600,
  },
  {
    id: "happy",
    label: "Happy",
    background: "#fdd554",
    menu: "#9c7918",
    date: "#fadc8c",
    fade: "linear-gradient(to bottom, rgba(246,182,21,0) 0%, #d38103 100%)",
    knob: "#f9c926",
    preview: "/projects/mood-tracker/previews/happy.png",
    loopMs: 9600,
  },
  {
    id: "excited",
    label: "Excited",
    background: "#fb7c32",
    menu: "#e04b0e",
    date: "#ffa87f",
    fade: "linear-gradient(to bottom, rgba(248,90,38,0) 0%, #d63d02 100%)",
    knob: "#fd6209",
    preview: "/projects/mood-tracker/previews/excited.png",
    loopMs: 12000,
  },
  {
    id: "overjoyed",
    label: "Overjoyed",
    background: "#fb577b",
    menu: "#591331",
    date: "#ff8daf",
    fade: "linear-gradient(to bottom, rgba(248,53,113,0) 0%, #ab1449 100%)",
    knob: "#f33474",
    preview: "/projects/mood-tracker/previews/overjoyed.png",
    loopMs: 9600,
  },
  {
    id: "angry",
    label: "Angry",
    background: "#a61c2d",
    menu: "#3e0a17",
    date: "#ff7785",
    fade: "linear-gradient(to bottom, rgba(223,44,71,0) 0%, #6a0d20 100%)",
    knob: "#c7102a",
    preview: "/projects/mood-tracker/previews/angry.png",
    loopMs: 9600,
  },
];

export const MOOD_COUNT = MOODS.length;
