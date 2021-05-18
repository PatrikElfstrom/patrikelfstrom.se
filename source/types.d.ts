import type { Sprite as PixiSprite } from '@pixi/sprite';
import type { Polygon } from '@pixi/math';
import type { IRendererOptions } from '@pixi/core';

export interface Sprite extends PixiSprite {
  age: number;
  added: number;
  hitArea: Polygon;
}

export interface Textures {
  [key: number]: RenderTexture;
}

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

export interface TrianglesOptions extends IRendererOptions {
  backgroundColor: number;
  resizeTo?: HTMLElement;
  size: number;
}
