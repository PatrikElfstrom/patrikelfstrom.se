import { Renderer, BatchRenderer } from '@pixi/core';
import { Application } from '@pixi/app';
import { Container } from '@pixi/display';
import { EventEmitter } from '@pixi/utils';
import { TickerPlugin } from '@pixi/ticker';
import { debounce } from 'lodash-es';
import { randomHslGenerator, hslToHex } from '../../helpers/colors';
import { Triangle } from './Triangle';
import { Textures, TriangleRenderCallback, Positions, TrianglesOptions, Sprite } from '../../types';
import { randomNumber } from '../../helpers/numbers';

Renderer.registerPlugin('batch', BatchRenderer);
Application.registerPlugin(TickerPlugin);

export class TriangleGrid extends Application {
  trianglePositions: Positions[] = [];

  logoTrianglePositions: Positions[] = [];

  triangles: Promise<Sprite>[] = [];

  triangle: Triangle;

  size!: number;

  trianglesPerRow!: number;

  trianglesPerColumn!: number;

  container: Container;

  textures: Textures = {};

  events: EventEmitter;

  renderQueue: boolean[] = [];

  centerPosition!: Positions;

  constructor(options: TrianglesOptions) {
    super(options);

    this.ticker.stop();

    this.events = new EventEmitter();

    this.triangle = new Triangle(options.size);

    // Create a container
    this.container = new Container();

    // Add container to stage
    this.stage.addChild(this.container);

    this.generateTriangles();

    window.addEventListener('resize', debounce(this.generateTriangles, 100));
  }

  generateTriangles = (): void => {
    this.renderQueue.push(true);
    this.ticker.start();

    // Remove existing children so we don't get duplicates
    this.container.removeChildren();

    ({ trianglesPerRow: this.trianglesPerRow, trianglesPerColumn: this.trianglesPerColumn } =
      this.calculateNumberOfTriangles());

    let isLeftPointing = false;
    let offsets = 0;
    while (!isLeftPointing) {
      this.trianglePositions = this.calculateTrianglePositions();
      this.centerPosition = this.getCenterPosition(
        this.trianglesPerRow,
        this.trianglesPerColumn,
        offsets,
      );

      isLeftPointing = this.centerPosition?.scale.y === -1;
      offsets += 1;
    }

    this.logoTrianglePositions = this.calculateLogoTrianglePositions();

    this.triangles = this.renderTriangles(({ color, positions, delay }) => {
      if (
        this.logoTrianglePositions.some(
          (trianglePosition) =>
            trianglePosition?.grid?.x === positions?.grid?.x &&
            trianglePosition?.grid?.y === positions?.grid?.y,
        )
      ) {
        delay = randomNumber(500, 2000);
        color = hslToHex(randomHslGenerator(200, 100, 30, 0, 10));
      }

      return { color, positions, delay };
    });

    // Stop ticker when all triangles are done
    Promise.all(this.triangles)
      .then(() => this.renderQueue.pop())
      // stop ticker if there is nothing rendering
      .then(() => this.renderQueue.length <= 0 && this.ticker.stop())
      .catch((error) => {
        throw error;
      });
  };

  calculateNumberOfTriangles(): {
    trianglesPerRow: number;
    trianglesPerColumn: number;
  } {
    const initialTrianglesPerRow = this.screen.width / this.triangle.height;

    // Round to nearest even number
    const trianglesPerRow = Math.round(initialTrianglesPerRow / 2) * 2;

    const triangleHeight = this.screen.width / trianglesPerRow;

    // Set new triangle height
    this.triangle.height = triangleHeight;

    // Divide by half since each triangle interlock
    // add one since we see the next row
    const trianglesPerColumn = Math.ceil(this.screen.height / (this.triangle.width / 2)) + 1;

    return { trianglesPerRow, trianglesPerColumn };
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  getCenterPosition(trianglesPerRow: number, trianglesPerColumn: number, offset: number) {
    // Calculate the center position
    const positionX = Math.round(trianglesPerRow / 2);
    let positionY = Math.round(trianglesPerColumn / 2);

    // Move the center position up a bit
    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    positionY = Math.ceil(positionY / goldenRatio) - offset;

    const centerPosition = this.trianglePositions.find(
      (position) => position?.grid?.y >= positionY && position?.grid?.x === positionX,
    );

    if (!centerPosition) {
      throw new Error('Could not find center position');
    }

    return centerPosition;
  }

  calculateLogoTrianglePositions(): Positions[] {
    if (!this.centerPosition) {
      throw new Error('No center position');
    }

    const positionX = this.centerPosition.grid.x;
    const positionY = this.centerPosition.grid.y;

    // The logo design
    const triangles = [
      // Center
      { y: 0, x: 0 },
      { y: -1, x: 0 },
      { y: -1, x: -1 },
      { y: 0, x: -1 },
      { y: 1, x: -1 },
      { y: 1, x: 0 },

      // Ring Left
      { y: -5, x: -1 },
      { y: -4, x: -1 },
      { y: -4, x: -2 },
      { y: -3, x: -2 },
      { y: -3, x: -3 },
      { y: -2, x: -3 },
      { y: -1, x: -3 },
      { y: 0, x: -3 },
      { y: 1, x: -3 },
      { y: 2, x: -3 },
      { y: 3, x: -3 },

      // Ring right
      { y: -5, x: 0 },
      { y: -4, x: 0 },
      { y: -4, x: 1 },
      { y: -3, x: 1 },
      { y: -3, x: 2 },
      { y: -2, x: 2 },
      { y: -1, x: 2 },
      { y: 0, x: 2 },
      { y: 1, x: 2 },
      { y: 2, x: 2 },
      { y: 3, x: 2 },
      { y: 3, x: 1 },
      { y: 4, x: 1 },
      { y: 4, x: 0 },
      { y: 5, x: 0 },
      { y: 5, x: -1 },
      { y: 4, x: -1 },
    ];

    return triangles.map((triangle) => {
      const xIndex = positionX + triangle.x;
      const yIndex = positionY + triangle.y;
      let xPixel = xIndex * this.triangle.height;
      const yPixel = (yIndex * this.triangle.width) / 2;

      // Add 50% because of reasons
      xPixel += this.triangle.height / 2;

      // Flip every even column in every odd row
      // And flip every odd column in every even row
      const yScale =
        (yIndex % 2 === 0 && xIndex % 2 === 1) || (yIndex % 2 === 1 && xIndex % 2 === 0) ? -1 : 1;

      return {
        grid: { x: xIndex, y: yIndex },
        pixel: {
          x: xPixel,
          y: yPixel,
        },
        scale: { x: 1, y: yScale },
      };
    });
  }

  calculateTrianglePositions(): Positions[] {
    const trianglePositions = [];

    for (let xIndex = 0; xIndex < this.trianglesPerRow; xIndex += 1) {
      for (let yIndex = 0; yIndex < this.trianglesPerColumn; yIndex += 1) {
        const position: Positions = {
          grid: { x: xIndex, y: yIndex },
          pixel: { x: 0, y: 0 },
          scale: { x: 1, y: 1 },
        };

        // Flip every even column in every odd row
        if (yIndex % 2 === 0 && xIndex % 2 === 1) {
          position.scale.y = -1;
        }

        // Flip every odd column in every even row
        if (yIndex % 2 === 1 && xIndex % 2 === 0) {
          position.scale.y = -1;
        }

        // Move the each row 50% to the right
        // Since we start from the triangle center
        position.pixel.x += this.triangle.height / 2;

        // Position triangle
        position.pixel.x += xIndex * this.triangle.height;
        position.pixel.y += (yIndex * this.triangle.width) / 2;

        trianglePositions.push(position);
      }
    }

    return trianglePositions;
  }

  renderTriangles(triangleRenderCallback?: TriangleRenderCallback): Promise<Sprite>[] {
    return this.trianglePositions.map(
      (trianglePosition) =>
        new Promise((resolve) => {
          const hexColor = hslToHex(randomHslGenerator());
          const visibilityDelay = randomNumber(0, 500);

          const { color, positions, delay } =
            typeof triangleRenderCallback === 'function'
              ? triangleRenderCallback({
                  color: hexColor,
                  positions: trianglePosition,
                  delay: visibilityDelay,
                })
              : {
                  color: hexColor,
                  positions: trianglePosition,
                  delay: visibilityDelay,
                };

          // Only generate if no texture with the same color has been generated
          if (!Object.prototype.hasOwnProperty.call(this.textures, color)) {
            const graphics = this.triangle.generateGraphics(color);
            const texture = Triangle.generateTexture(graphics, this.renderer as Renderer);

            this.textures[color] = texture;
          }

          const sprite = this.triangle.createSprite(this.textures[color]);

          sprite.scale.y = positions.scale.y;
          sprite.scale.x = positions.scale.x;
          sprite.x = positions.pixel.x;
          sprite.y = positions.pixel.y;

          const spriteTargetAlpha = 1;

          const transitionSpeed = 1; // In seconds
          const fps = 60;
          const transitionSpeedPerFrame = (fps * transitionSpeed) / 1000;

          const showSprite = () => {
            sprite.age = Date.now() - sprite.added;

            // Delay sprite
            if (sprite.age >= delay) {
              // Remove ticker if sprite is fully visible
              if (sprite.alpha < spriteTargetAlpha) {
                sprite.alpha += transitionSpeedPerFrame * this.ticker.deltaTime;
              } else {
                this.ticker.remove(showSprite);
                resolve(sprite);
              }
            }
          };

          this.ticker.add(showSprite);

          sprite.on('added', () => {
            sprite.added = Date.now();
          });

          this.container.addChild(sprite);
        }),
    );
  }
}
