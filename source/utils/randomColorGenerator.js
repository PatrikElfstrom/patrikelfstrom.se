import randomNumber from './randomNumber';

export default (hue = 0, saturation = 0, lightness = 10, min = 0, max = 5) => `hsl(${hue}, ${saturation}%, ${lightness + randomNumber(min, max)}%)`;
