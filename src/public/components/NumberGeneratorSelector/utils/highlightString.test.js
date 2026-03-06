import { render } from '@folio/jest-config-stripes/testing-library/react';

import highlightString from './highlightString';

const renderHighlighted = (match, str, ignoreNull, simpleSplit) => {
  const result = highlightString(match, str, ignoreNull, simpleSplit);
  const { container } = render(<span>{result}</span>);
  return container;
};

describe('highlightString', () => {
  describe('basic highlighting', () => {
    test('wraps matched text in <mark> tags', () => {
      const container = renderHighlighted('hello', 'say hello world');
      const marks = container.querySelectorAll('mark');
      expect(marks).toHaveLength(1);
      expect(marks[0].textContent).toBe('hello');
    });

    test('wraps non-matched text in <span> tags', () => {
      const container = renderHighlighted('hello', 'say hello world');
      const spans = container.querySelectorAll(':scope > span > span');
      expect(spans.length).toBeGreaterThanOrEqual(1);
    });

    test('match is case insensitive', () => {
      const container = renderHighlighted('HELLO', 'say hello world');
      const marks = container.querySelectorAll('mark');
      expect(marks).toHaveLength(1);
      expect(marks[0].textContent).toBe('hello');
    });

    test('highlights multiple occurrences', () => {
      const container = renderHighlighted('o', 'foo boo');
      const marks = container.querySelectorAll('mark');
      expect(marks.length).toBeGreaterThanOrEqual(2);
    });

    test('returns full string without marks when no match', () => {
      const container = renderHighlighted('xyz', 'hello world');
      const marks = container.querySelectorAll('mark');
      expect(marks).toHaveLength(0);
      expect(container.textContent).toBe('hello world');
    });
  });

  describe('ignoreNull behavior', () => {
    test('returns full string without highlighting when match is empty', () => {
      const container = renderHighlighted('', 'hello world');
      expect(container.textContent).toBe('hello world');
      const marks = container.querySelectorAll('mark');
      expect(marks).toHaveLength(0);
    });
  });

  describe('space preservation (simpleSplit=false)', () => {
    test('search "A" in "AN 2025" displays "AN 2025"', () => {
      const container = renderHighlighted('A', 'AN 2025', true, false);
      expect(container.textContent).toBe('AN 2025');
    });

    test('search "AN" in "AN 2025" displays "AN 2025"', () => {
      const container = renderHighlighted('AN', 'AN 2025', true, false);
      expect(container.textContent).toBe('AN 2025');
    });

    test('search "AN " (with trailing space) in "AN 2025" displays "AN 2025"', () => {
      const container = renderHighlighted('AN ', 'AN 2025', true, false);
      expect(container.textContent).toBe('AN 2025');
    });

    test('search "AN 2025" in "AN 2025" displays "AN 2025"', () => {
      const container = renderHighlighted('AN 2025', 'AN 2025', true, false);
      expect(container.textContent).toBe('AN 2025');
    });

    test('spaces between words are preserved with partial match', () => {
      const container = renderHighlighted('hello', 'hello world', true, false);
      expect(container.textContent).toBe('hello world');
    });

    test('multiple spaces in string are all preserved', () => {
      const container = renderHighlighted('AB', 'AB CD EF', true, false);
      expect(container.textContent).toBe('AB CD EF');
    });

    test('spaces preserved when match is at end of string', () => {
      const container = renderHighlighted('world', 'hello world', true, false);
      expect(container.textContent).toBe('hello world');
    });

    test('spaces preserved with multiple matches', () => {
      const container = renderHighlighted('a', 'a b a', true, false);
      expect(container.textContent).toBe('a b a');
    });
  });

  // The parent component renders highlighted parts inside a display-flex
  // container. Flex items are blockified, causing CSS to trim leading
  // whitespace (white-space: normal). Elements need whiteSpace: 'pre'
  // to prevent this.
  describe('whitespace style on rendered elements', () => {
    test('mark elements have whiteSpace pre style', () => {
      const container = renderHighlighted('AN', 'AN 2025', true, false);
      const marks = container.querySelectorAll('mark');
      expect(marks.length).toBeGreaterThanOrEqual(1);
      marks.forEach(mark => {
        expect(mark.style.whiteSpace).toBe('pre');
      });
    });

    test('span elements have whiteSpace pre style', () => {
      const container = renderHighlighted('AN', 'AN 2025', true, false);
      const spans = container.querySelectorAll(':scope > span > span');
      expect(spans.length).toBeGreaterThanOrEqual(1);
      spans.forEach(span => {
        expect(span.style.whiteSpace).toBe('pre');
      });
    });

    test('elements with leading whitespace have whiteSpace pre style', () => {
      const container = renderHighlighted('hello', 'hello world', true, false);
      const spans = container.querySelectorAll(':scope > span > span');
      const spansWithLeadingSpace = [...spans].filter(s => s.textContent.startsWith(' '));
      expect(spansWithLeadingSpace.length).toBeGreaterThanOrEqual(1);
      spansWithLeadingSpace.forEach(span => {
        expect(span.style.whiteSpace).toBe('pre');
      });
    });
  });

  describe('space preservation (simpleSplit=true)', () => {
    test('search "AN" in "AN 2025" displays "AN 2025"', () => {
      const container = renderHighlighted('AN', 'AN 2025');
      expect(container.textContent).toBe('AN 2025');
    });

    test('search "AN 2025" in "AN 2025" displays "AN 2025"', () => {
      const container = renderHighlighted('AN 2025', 'AN 2025');
      expect(container.textContent).toBe('AN 2025');
    });

    test('spaces preserved when match is at end of string', () => {
      const container = renderHighlighted('world', 'hello world');
      expect(container.textContent).toBe('hello world');
    });

    test('spaces preserved with multiple matches', () => {
      const container = renderHighlighted('a', 'a b a');
      expect(container.textContent).toBe('a b a');
    });
  });
});
