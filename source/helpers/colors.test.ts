import { randomNumber, randomHslGenerator, hslToHex } from './colors';

it('Random number', () => {
  const number = randomNumber(1, 10);
  expect(number).toBeGreaterThanOrEqual(1);
  expect(number).toBeLessThanOrEqual(10);
});

it('HSL color with random lightness', () => {
  const { hue, saturation, lightness } = randomHslGenerator(180, 50, 50, 0, 10);

  expect(hue).toBe(180);
  expect(saturation).toBe(50);
  expect(lightness).toBeGreaterThanOrEqual(50);
  expect(lightness).toBeLessThanOrEqual(60);
});

it('HSL to HEX', () => {
  const hslColor = { hue: 180, saturation: 50, lightness: 50 };
  const hexColor = hslToHex(hslColor);
  expect(hexColor).toBe(4243391);
});
