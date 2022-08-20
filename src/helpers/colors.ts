import * as colorConvert from 'color-convert';
import type { HSL } from 'color-convert/conversions';
import { randomNumber } from './numbers';

interface Hsl {
  hue: number;
  saturation: number;
  lightness: number;
}

export const randomHslGenerator = (
  hue = 0,
  saturation = 0,
  _lightness = 10,
  min = 0,
  max = 5,
): Hsl => {
  const lightness = _lightness + randomNumber(min, max);
  return { hue, saturation, lightness };
};

export const hslToHex = (hsl: Hsl): number => {
  const hexColor = colorConvert.hsl.hex(Object.values(hsl) as HSL);
  return Number.parseInt(`0x${hexColor}`, 16);
};
