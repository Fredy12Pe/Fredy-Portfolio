/** Figma spring from Mood Tracker idle timelines. */
export const springA = (t: number) =>
  1 - Math.exp(-t * 7.4426) * (Math.cos(t * 10.5254) + 0.7071 * Math.sin(t * 10.5254));

export const springB = (t: number) =>
  1 - Math.exp(-t * 7.6657) * (Math.cos(t * 6.7605) + 1.1339 * Math.sin(t * 6.7605));

export const springC = (t: number) =>
  1 - Math.exp(-t * 7.956) * (Math.cos(t * 4.2942) + 1.8527 * Math.sin(t * 4.2942));

type Ease = string | number[] | ((t: number) => number) | Array<string | number[] | ((t: number) => number)>;

export const loop = (duration: number, ease: Ease = "easeInOut") => ({
  duration,
  ease,
  repeat: Infinity,
});

export const loopTimes = (duration: number, times: number[], ease: Ease = "easeInOut") => ({
  duration,
  times,
  ease,
  repeat: Infinity,
});

export const ASSET = "/projects/mood-tracker/assets";
