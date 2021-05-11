import colorConvert from 'color-convert';

export function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function randomHslGenerator(
  hue = 0,
  saturation = 0,
  _lightness = 10,
  min = 0,
  max = 5
) {
  const lightness = _lightness + randomNumber(min, max);
  return { hue, saturation, lightness };
}

export function hslToHex(hsl) {
  const hexColor = colorConvert.hsl.hex(Object.values(hsl));
  return parseInt(`0x${hexColor}`, 16);
}
