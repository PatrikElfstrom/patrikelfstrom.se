import debounce from 'debounce-fn';
import { randomHslGenerator, hslToHex } from '../../helpers/colors';
import { Triangle } from './triangle';
import type {
  TriangleRenderCallback,
  Positions,
  TrianglesOptions,
} from './types';
import { randomNumber } from '../../helpers/numbers';
import { Application, Container, type Rectangle, type Texture, type Ticker } from 'pixi.js';

const GOLDEN_RATIO = (1 + Math.sqrt(5)) / 2;
const FADE_ALPHA_STEP = 0.06;
const LOGO_TRIANGLE_OFFSETS: ReadonlyArray<{ x: number; y: number }> = [
  { y: 0, x: 0 },
  { y: -1, x: 0 },
  { y: -1, x: -1 },
  { y: 0, x: -1 },
  { y: 1, x: -1 },
  { y: 1, x: 0 },
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

interface TriangleGridState {
  app: Application;
  triangle: Triangle;
  container: Container;
  textureCache: Map<number, Texture>;
  activeAnimations: Set<(ticker: Ticker) => void>;
  pendingAnimations: number;
  generation: number;
}

export async function createTriangleGrid(options: TrianglesOptions): Promise<void> {
  const app = new Application();

  await app.init({
    canvas: options.canvas,
    backgroundColor: options.backgroundColor,
    antialias: true,
    autoStart: false,
    resolution: options.resolution ?? window.devicePixelRatio ?? 1,
    autoDensity: options.autoDensity ?? true,
    preference: 'webgl',
    resizeTo: options.resizeTo ?? window,
  });

  const triangle = new Triangle(options.size);
  const container = new Container();
  app.stage.addChild(container);

  const state: TriangleGridState = {
    app,
    triangle,
    container,
    textureCache: new Map(),
    activeAnimations: new Set(),
    pendingAnimations: 0,
    generation: 0,
  };

  const regenerate = () => renderTriangleGrid(state);

  const scheduleRegenerate = debounce(regenerate, {
    wait: 50,
  });
  window.addEventListener('resize', scheduleRegenerate);

  regenerate();

}

const renderTriangleGrid = (state: TriangleGridState): void => {
  state.generation += 1;

  cancelAnimations(state);
  clearContainer(state.container);
  destroyTextures(state.textureCache);

  const { trianglesPerRow, trianglesPerColumn } = calculateNumberOfTriangles(
    state.app.screen,
    state.triangle,
  );
  const trianglePositions = calculateTrianglePositions(
    trianglesPerRow,
    trianglesPerColumn,
    state.triangle,
  );
  let centerPosition: Positions | undefined;

  for (let offset = 0; offset < trianglesPerColumn; offset += 1) {
    const currentCenterPosition = getCenterPosition(
      trianglesPerRow,
      trianglesPerColumn,
      offset,
      trianglePositions,
    );

    if (currentCenterPosition.scale.y === -1) {
      centerPosition = currentCenterPosition;
      break;
    }
  }

  if (!centerPosition) {
    throw new Error('Could not find center position');
  }

  const logoTrianglePositions = calculateLogoTrianglePositions(centerPosition, state.triangle);
  const logoTriangleKeys = new Set(
    logoTrianglePositions.map((position) => `${position.grid.x}:${position.grid.y}`),
  );

  renderTriangles(state, trianglePositions, state.generation, ({ color, positions, delay }) => {
    if (logoTriangleKeys.has(`${positions.grid.x}:${positions.grid.y}`)) {
      return {
        color: hslToHex(randomHslGenerator(200, 100, 30, 0, 10)),
        positions,
        delay: randomNumber(500, 2000),
      };
    }

    return { color, positions, delay };
  });

  if (state.pendingAnimations > 0) {
    state.app.start();
  } else {
    state.app.stop();
  }
};

const calculateNumberOfTriangles = (
  screen: Rectangle,
  triangle: Triangle,
): {
  trianglesPerRow: number;
  trianglesPerColumn: number;
} => {
  const initialTrianglesPerRow = screen.width / triangle.height;
  const trianglesPerRow = Math.round(initialTrianglesPerRow / 2) * 2;

  triangle.height = screen.width / trianglesPerRow;

  // Divide by half since each triangle interlocks.
  const trianglesPerColumn = Math.ceil(screen.height / (triangle.width / 2)) + 1;

  return { trianglesPerRow, trianglesPerColumn };
};

const getCenterPosition = (
  trianglesPerRow: number,
  trianglesPerColumn: number,
  offset: number,
  trianglePositions: Positions[],
): Positions => {
  const positionX = Math.round(trianglesPerRow / 2);
  const middleRow = Math.round(trianglesPerColumn / 2);
  const positionY = Math.ceil(middleRow / GOLDEN_RATIO) - offset;

  const centerPosition = trianglePositions.find(
    (position) => position.grid.y >= positionY && position.grid.x === positionX,
  );

  if (centerPosition) {
    return centerPosition;
  }

  throw new Error('Could not find center position');
};

const calculateLogoTrianglePositions = (
  centerPosition: Positions,
  triangle: Triangle,
): Positions[] => {
  if (!centerPosition) {
    throw new Error('No center position');
  }

  const positionX = centerPosition.grid.x;
  const positionY = centerPosition.grid.y;

  return LOGO_TRIANGLE_OFFSETS.map(({ x, y }) =>
    createTrianglePosition(positionX + x, positionY + y, triangle),
  );
};

const calculateTrianglePositions = (
  trianglesPerRow: number,
  trianglesPerColumn: number,
  triangle: Triangle,
): Positions[] => {
  const trianglePositions: Positions[] = [];

  for (let xIndex = 0; xIndex < trianglesPerRow; xIndex += 1) {
    for (let yIndex = 0; yIndex < trianglesPerColumn; yIndex += 1) {
      trianglePositions.push(createTrianglePosition(xIndex, yIndex, triangle));
    }
  }

  return trianglePositions;
};

const createTrianglePosition = (xIndex: number, yIndex: number, triangle: Triangle): Positions => ({
  grid: { x: xIndex, y: yIndex },
  pixel: {
    x: triangle.height / 2 + xIndex * triangle.height,
    y: (yIndex * triangle.width) / 2,
  },
  scale: { x: 1, y: calculateScaleY(xIndex, yIndex) },
});

const calculateScaleY = (xIndex: number, yIndex: number): number => {
  if ((yIndex % 2 === 0 && xIndex % 2 === 1) || (yIndex % 2 === 1 && xIndex % 2 === 0)) {
    return -1;
  }

  return 1;
};

const renderTriangles = (
  state: TriangleGridState,
  trianglePositions: Positions[],
  generation: number,
  triangleRenderCallback?: TriangleRenderCallback,
): void => {
  trianglePositions.forEach((trianglePosition) => {
    const defaultColor = hslToHex(randomHslGenerator());
    const defaultDelay = randomNumber(0, 500);
    const { color, positions, delay } =
      typeof triangleRenderCallback === 'function'
        ? triangleRenderCallback({
            color: defaultColor,
            positions: trianglePosition,
            delay: defaultDelay,
          })
        : {
            color: defaultColor,
            positions: trianglePosition,
            delay: defaultDelay,
          };
    const texture = getTriangleTexture(state, color);
    const sprite = state.triangle.createSprite(texture);

    sprite.scale.set(positions.scale.x, positions.scale.y);
    sprite.position.set(positions.pixel.x, positions.pixel.y);

    state.container.addChild(sprite);
    fadeInTriangle(state, sprite, delay, generation);
  });
};

const getTriangleTexture = (state: TriangleGridState, color: number): Texture => {
  const cachedTexture = state.textureCache.get(color);

  if (cachedTexture) {
    return cachedTexture;
  }

  const texture = state.triangle.createTexture(color, state.app.renderer);

  state.textureCache.set(color, texture);

  return texture;
};

const fadeInTriangle = (
  state: TriangleGridState,
  sprite: Container,
  delay: number,
  generation: number,
): void => {
  let elapsedMs = 0;

  state.pendingAnimations += 1;

  const tick = (ticker: Ticker): void => {
    if (generation !== state.generation || sprite.destroyed) {
      finishAnimation(state, tick, generation);
      return;
    }

    elapsedMs += ticker.deltaMS;

    if (elapsedMs < delay) {
      return;
    }

    sprite.alpha = Math.min(sprite.alpha + FADE_ALPHA_STEP * ticker.deltaTime, 1);

    if (sprite.alpha >= 1) {
      finishAnimation(state, tick, generation);
    }
  };

  state.activeAnimations.add(tick);
  state.app.ticker.add(tick);
};

const finishAnimation = (
  state: TriangleGridState,
  tick: (ticker: Ticker) => void,
  generation: number,
): void => {
  if (!state.activeAnimations.delete(tick)) {
    return;
  }

  state.app.ticker.remove(tick);
  state.pendingAnimations = Math.max(0, state.pendingAnimations - 1);

  if (generation === state.generation && state.pendingAnimations === 0) {
    state.app.stop();
  }
};

const cancelAnimations = (state: TriangleGridState): void => {
  state.activeAnimations.forEach((tick) => {
    state.app.ticker.remove(tick);
  });

  state.activeAnimations.clear();
  state.pendingAnimations = 0;
  state.app.stop();
};

const clearContainer = (container: Container): void => {
  container.removeChildren().forEach((child) => {
    child.destroy();
  });
};

const destroyTextures = (textureCache: Map<number, Texture>): void => {
  textureCache.forEach((texture) => {
    texture.destroy(true);
  });

  textureCache.clear();
};
