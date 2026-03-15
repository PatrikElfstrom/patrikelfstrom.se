import {
  Graphics,
  Point,
  Polygon,
  type Renderer,
  type Texture,
  Sprite as PixiSprite,
} from 'pixi.js';
import type { TriangleSize } from './types';

export class Triangle {
  readonly polygon: Polygon;

  width: number;

  height: number;

  constructor(size: number) {
    const { width, height } = Triangle.calculateSize(size);
    this.polygon = Triangle.createPolygon({ width, height });

    this.width = width;
    this.height = height;
  }

  static calculateSize(width: number): TriangleSize {
    const height = Math.round(Math.sqrt(width ** 2 - (width / 2) ** 2));

    return { width, height };
  }

  static createPolygon({ width, height }: TriangleSize): Polygon {
    return new Polygon([new Point(0, height), new Point(width / 2, 0), new Point(width, height)]);
  }

  generateGraphics(color: number): Graphics {
    const graphics = new Graphics();

    graphics.poly(this.polygon.points);
    graphics.fill({ color, alpha: 1 });
    graphics.stroke({
      color,
      width: 1,
      alignment: 0.5,
      alpha: 1,
    });

    return graphics;
  }

  createTexture(color: number, renderer: Renderer): Texture {
    const graphics = this.generateGraphics(color);
    const texture = renderer.generateTexture(graphics);

    graphics.destroy();

    return texture;
  }

  createSprite(texture: Texture): PixiSprite {
    const sprite = PixiSprite.from(texture);

    // Rotate 90 deg
    sprite.rotation = Math.PI / 2;

    // Set sprite anchor to middle
    sprite.anchor.set(0.5);

    // Reset position because of change to anchor
    sprite.position.set(this.height / 2, this.width / 2);

    // Since we changed the anchor
    // We need to recalculate the hit area
    sprite.hitArea = this.calculateSpriteHitArea();

    // Hide as default
    sprite.alpha = 0;

    return sprite;
  }

  calculateSpriteHitArea(): Polygon {
    return new Polygon([
      new Point(-this.width / 2, this.height / 2),
      new Point(0, -this.height / 2),
      new Point(this.width / 2, this.height / 2),
    ]);
  }
}
