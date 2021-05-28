import { randomHslGenerator, hslToHex } from './colors';

describe('colors', () => {
  it('should generate HSL color with random lightness', () => {
    expect.assertions(4);
    const { hue, saturation, lightness } = randomHslGenerator(180, 50, 50, 0, 10);

    expect(hue).toBe(180);
    expect(saturation).toBe(50);
    expect(lightness).toBeGreaterThanOrEqual(50);
    expect(lightness).toBeLessThanOrEqual(60);
  });

  it('should convert HSL to HEX', () => {
    expect.assertions(1);
    const hslColor = { hue: 180, saturation: 50, lightness: 50 };
    const hexColor = hslToHex(hslColor);
    expect(hexColor).toBe(4_243_391);
  });
});
