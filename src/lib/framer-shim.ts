export const ControlType = {
  Boolean: "boolean",
  Color: "color",
  Number: "number",
  Object: "object",
  Enum: "enum",
} as const;

export const RenderTarget = {
  canvas: "canvas",
  current: () => "preview",
} as const;

export function addPropertyControls(): void {
  // No-op outside Framer's editor runtime.
}
