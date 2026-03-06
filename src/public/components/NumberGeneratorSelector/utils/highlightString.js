import matchString from './matchString';

const highlightString = (match, str, ignoreNull = true, simpleSplit = true) => {
  const [parts, regex] = matchString(match, str, ignoreNull, simpleSplit);

  return (
    parts.map((part, i) => {
      // RegExp is stateful, set up a new one to work with
      const immutableRegex = new RegExp(regex);
      if (immutableRegex.exec(part) !== null) {
        return (
          <mark
            key={i}
          >
            {part}
          </mark>
        );
      }

      return (
        <span key={i}>
          {part}
        </span>
      );
    })
  );
};

export default highlightString;
