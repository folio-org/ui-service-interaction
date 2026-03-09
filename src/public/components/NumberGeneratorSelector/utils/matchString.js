import escapeRegExp from 'lodash/escapeRegExp';

const matchString = (match, str, ignoreNull = true, simpleSplit = true) => {
  // Simple regex split -- this is default behaviour
  const regexSimple = new RegExp(`${match.split(/(\s+)/).filter(h => h.trim()).map(hl => '(' + escapeRegExp(hl) + ')').join('|')}`, 'gi');

  // Split Elvis "The King" Presley into [Elvis, The King, Presley]
  const quotedParts = match.match(/"[^"]*"|\S+/g) || [];
  const regex = new RegExp(`${
    quotedParts
         .filter(h => h.trim())
         .map(quotedSection => {
            if (quotedSection.charAt(0) === '"' && quotedSection.charAt(quotedSection.length - 1) === '"') {
              return quotedSection.slice(1, -1);
            }
            return quotedSection;
          })
         .map(hl => '(' + escapeRegExp(hl) + ')')
         .join('|')
    }`,
    'gi');

  if (ignoreNull && !match) {
    const nullRegex = /a^/gi; // Should match nothing

    return [[str], nullRegex];
  }

  if (simpleSplit) {
    return [str.split(regexSimple)?.filter(s => s != null && s !== ''), regexSimple];
  }

  return [str.split(regex)?.filter(s => s != null && s !== ''), regex];
};

export default matchString;
