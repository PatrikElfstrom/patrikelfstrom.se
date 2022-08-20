import { describe, expect, it } from 'vitest';
import { randomNumber } from './numbers';

describe('number', () => {
  it('should generate random number', () => {
    expect.assertions(2);
    const number = randomNumber(1, 10);
    expect(number).toBeGreaterThanOrEqual(1);
    expect(number).toBeLessThanOrEqual(10);
  });
});
