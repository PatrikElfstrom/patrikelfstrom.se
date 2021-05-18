import colorConvert from 'color-convert';
import { HSL } from 'color-convert/conversions';

interface Hsl {
  hue: number;
  saturation: number;
  lightness: number;
}

export function randomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function randomHslGenerator(
  hue = 0,
  saturation = 0,
  _lightness = 10,
  min = 0,
  max = 5,
): Hsl {
  const lightness = _lightness + randomNumber(min, max);
  return { hue, saturation, lightness };
}

export function hslToHex(hsl: Hsl): number {
  const hexColor = colorConvert.hsl.hex(Object.values(hsl) as HSL);
  return Number.parseInt(`0x${hexColor}`, 16);
}
