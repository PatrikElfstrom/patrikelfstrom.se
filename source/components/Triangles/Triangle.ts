import { Polygon, Point } from '@pixi/math';
import { settings, SmoothGraphics as Graphics } from '@pixi/graphics-smooth';
import { Renderer, RenderTexture } from '@pixi/core';
import { Sprite as PixiSprite } from '@pixi/sprite';
import type { Sprite, TriangleSize } from '../../types';

settings.PIXEL_LINE = 1;

export class Triangle {
  polygon!: Polygon;

  graphics!: Graphics;

  texture!: RenderTexture;

  sprite!: Sprite;

  width!: number;

  height!: number;

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

    // Defringe edges
    graphics.lineStyle({
      color,
      width: 1,
      alignment: 0.5,
      alpha: 1,
    });

    graphics.beginFill(color, 1, true);
    graphics.drawShape(this.polygon);
    graphics.endFill();

    return graphics;
  }

  static generateTexture(graphics: Graphics, renderer: Renderer): RenderTexture {
    return renderer.generateTexture(graphics);
  }

  createSprite(texture: RenderTexture): Sprite {
    const sprite = PixiSprite.from(texture) as Sprite;

    // Rotate 90 deg
    sprite.rotation = Math.PI / 2;

    // Set sprite anchor to middle
    sprite.anchor.set(0.5);

    // Reset position because of change to anchor
    sprite.x += this.height / 2;
    sprite.y += this.width / 2;

    // Since we changed the anchor
    // We need to recalculate the hit area
    sprite.hitArea = this.calculateSpriteHitArea();

    // Hide as default
    sprite.alpha = 0;

    // Set default age
    sprite.age = 0;

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
