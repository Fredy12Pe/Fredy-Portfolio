import type { CSSProperties, ReactNode } from "react";

// The pieces the case study boards share. Each project passes in its own colours, so every board keeps its palette.

// A rounded card on a board. Its background comes from the project, as a class or an inline style.
export function Panel({ className = "", style, children }: { className?: string; style?: CSSProperties; children: ReactNode }) {
  return (
    <div
      className={`flex min-w-0 flex-col gap-6 rounded-[28px] p-9 shadow-[0_10px_30px_rgba(0,0,0,0.08)] ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}

// The small uppercase label above a card's content, such as "Role" or "Timeline"
export function Label({ children, color = "#71717a" }: { children: ReactNode; color?: string }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color }}>
      {children}
    </p>
  );
}

// The heading above each group of cards: its eyebrow, title and an optional line
export function BoardHead({
  eyebrow,
  title,
  kicker,
  accent,
  titleColor,
  kickerColor = "#3f3f46",
}: {
  eyebrow: string;
  title: string;
  kicker?: string;
  accent: string;
  titleColor?: string;
  kickerColor?: string;
}) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs font-semibold uppercase tracking-[0.24em]" style={{ color: accent }}>
        {eyebrow}
      </p>
      <h2 className="text-[44px] font-bold leading-tight tracking-tight" style={{ color: titleColor ?? accent }}>
        {title}
      </h2>
      {kicker ? (
        <p className="text-lg leading-relaxed" style={{ color: kickerColor }}>
          {kicker}
        </p>
      ) : null}
    </div>
  );
}
