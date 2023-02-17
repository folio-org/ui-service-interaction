// Completely ridiculous test for coverage's sake alone
import { NUMBER_GENERATOR_ENDPOINT, NUMBER_GENERATORS_ENDPOINT } from './endpoints';

describe('Endpoints', () => {
  test('NUMBER_GENERATORS_ENDPOINT', () => {
    expect(NUMBER_GENERATORS_ENDPOINT).toBe('servint/numberGenerators');
  });

  test('NUMBER_GENERATOR_ENDPOINT', () => {
    expect(NUMBER_GENERATOR_ENDPOINT('123')).toBe('servint/numberGenerators/123');
  });
});
