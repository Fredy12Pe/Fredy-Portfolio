declare module "n8ao" {
  import type { Camera, Scene, WebGLRenderer } from "three";
  import type { Pass } from "three/examples/jsm/postprocessing/Pass.js";

  export class N8AOPass extends Pass {
    constructor(
      scene: Scene,
      camera: Camera,
      width?: number,
      height?: number,
    );
    configuration: Record<string, unknown>;
    setSize(width: number, height: number): void;
    render(
      renderer: WebGLRenderer,
      writeBuffer: unknown,
      readBuffer: unknown,
    ): void;
  }
}
