import matchString from './matchString';

const highlightString = (match, str, ignoreNull = true, simpleSplit = true) => {
  const [parts, regex] = matchString(match, str, ignoreNull, simpleSplit);

  return (
    parts.map((part) => {
      // RegExp is stateful, set up a new one to work with
      const immutableRegex = new RegExp(regex);
      if (immutableRegex.exec(part) !== null) {
        return (
          <mark
            key={`mark-${part}`}
            style={{ whiteSpace: 'pre' }}
          >
            {part}
          </mark>
        );
      }

      return (
        <span key={`span-${part}`} style={{ whiteSpace: 'pre' }}>
          {part}
        </span>
      );
    })
  );
};

export default highlightString;
