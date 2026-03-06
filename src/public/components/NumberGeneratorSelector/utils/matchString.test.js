import matchString from './matchString';

describe('matchString', () => {
  describe('simpleSplit=true (default)', () => {
    test('splits string by matched term', () => {
      const [parts] = matchString('hello', 'say hello world');
      expect(parts).toContain('hello');
    });

    test('match is case insensitive', () => {
      const [parts] = matchString('HELLO', 'say hello world');
      expect(parts).toContain('hello');
    });

    test('returns full string when no match found', () => {
      const [parts] = matchString('xyz', 'hello world');
      expect(parts).toEqual(['hello world']);
    });

    test('returns regex as second element', () => {
      const [, regex] = matchString('test', 'this is a test');
      expect(regex).toBeInstanceOf(RegExp);
      expect(regex.flags).toContain('g');
      expect(regex.flags).toContain('i');
    });

    test('highlights individual words from multi-word search term', () => {
      const [parts] = matchString('foo bar', 'foo baz bar');
      expect(parts).toContain('foo');
      expect(parts).toContain('bar');
    });

    test('preserves spaces when search matches start of string', () => {
      const [parts] = matchString('AN', 'AN 2025');
      expect(parts.join('')).toBe('AN 2025');
    });

    test('preserves spaces with multi-word search term', () => {
      const [parts] = matchString('AN 2025', 'AN 2025');
      expect(parts.join('')).toBe('AN 2025');
    });

    test('preserves multiple spaces in string', () => {
      const [parts] = matchString('AB', 'AB CD EF');
      expect(parts.join('')).toBe('AB CD EF');
    });

    test('preserves spaces when match is at end of string', () => {
      const [parts] = matchString('world', 'hello world');
      expect(parts.join('')).toBe('hello world');
    });

    test('preserves spaces with multiple matches', () => {
      const [parts] = matchString('a', 'a b a');
      expect(parts.join('')).toBe('a b a');
    });

    test('handles single character match', () => {
      const [parts] = matchString('A', 'AN 2025');
      expect(parts.join('')).toBe('AN 2025');
    });

    test('handles search term with trailing space', () => {
      const [parts] = matchString('AN ', 'AN 2025');
      expect(parts.join('')).toBe('AN 2025');
    });

    test('handles regex special characters in search term', () => {
      const [parts] = matchString('foo.bar', 'foo.bar baz');
      expect(parts).toContain('foo.bar');
      expect(parts.join('')).toBe('foo.bar baz');
    });

    test('handles parentheses in search term', () => {
      const [parts] = matchString('(test)', '(test) value');
      expect(parts).toContain('(test)');
      expect(parts.join('')).toBe('(test) value');
    });
  });

  describe('simpleSplit=false (quoted string support)', () => {
    test('treats quoted phrases as single search term', () => {
      const [parts] = matchString('"The King"', 'Elvis The King Presley', true, false);
      expect(parts).toContain('The King');
    });

    test('preserves spaces when search matches start of string', () => {
      const [parts] = matchString('AN', 'AN 2025', true, false);
      expect(parts.join('')).toBe('AN 2025');
    });

    test('preserves spaces with trailing space in search term', () => {
      const [parts] = matchString('AN ', 'AN 2025', true, false);
      expect(parts.join('')).toBe('AN 2025');
    });

    test('preserves spaces with full match search term', () => {
      const [parts] = matchString('AN 2025', 'AN 2025', true, false);
      expect(parts.join('')).toBe('AN 2025');
    });

    test('preserves spaces with partial match', () => {
      const [parts] = matchString('hello', 'hello world', true, false);
      expect(parts.join('')).toBe('hello world');
    });

    test('preserves multiple spaces in string', () => {
      const [parts] = matchString('AB', 'AB CD EF', true, false);
      expect(parts.join('')).toBe('AB CD EF');
    });

    test('preserves spaces when match is at end of string', () => {
      const [parts] = matchString('world', 'hello world', true, false);
      expect(parts.join('')).toBe('hello world');
    });

    test('preserves spaces with multiple matches', () => {
      const [parts] = matchString('a', 'a b a', true, false);
      expect(parts.join('')).toBe('a b a');
    });

    test('handles single character match', () => {
      const [parts] = matchString('A', 'AN 2025', true, false);
      expect(parts.join('')).toBe('AN 2025');
    });
  });

  describe('ignoreNull behavior', () => {
    test('returns full string with non-matching regex when match is empty and ignoreNull=true', () => {
      const [parts, regex] = matchString('', 'hello world', true);
      expect(parts).toEqual(['hello world']);
      expect(regex.exec('anything')).toBeNull();
    });
  });
});
