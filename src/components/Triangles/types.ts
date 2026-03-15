export interface Position {
  x: number;
  y: number;
}

export interface Positions {
  grid: Position;
  pixel: Position;
  scale: Position;
}

export interface TriangleRenderCallback {
  ({ color, positions, delay }: { color: number; positions: Positions; delay: number }): {
    color: number;
    positions: Positions;
    delay: number;
  };
}

export type TriangleSize = { width: number; height: number };

export interface TrianglesOptions {
  backgroundColor: number;
  resizeTo?: HTMLElement | Window;
  size: number;
  canvas: HTMLCanvasElement;
  resolution?: number;
  autoDensity?: boolean;
}
