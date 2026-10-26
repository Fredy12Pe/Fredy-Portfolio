// butterchurn ships without type declarations. This describes the parts the music player uses.
declare module "butterchurn" {
  type ButterchurnVisualizer = {
    connectAudio: (node: AudioNode) => void;
    loadPreset: (preset: unknown, blendSeconds: number) => void;
    setRendererSize: (width: number, height: number) => void;
    render: () => void;
  };

  const butterchurn: {
    createVisualizer(
      context: AudioContext,
      canvas: HTMLCanvasElement,
      options: { width: number; height: number; pixelRatio?: number; textureRatio?: number },
    ): ButterchurnVisualizer;
  };

  export default butterchurn;
}

// butterchurn-presets ships without type declarations as well
declare module "butterchurn-presets" {
  const presets: {
    getPresets(): Record<string, unknown>;
  };

  export default presets;
}
