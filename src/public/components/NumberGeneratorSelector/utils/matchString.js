import escapeRegExp from 'lodash/escapeRegExp';

const matchString = (match, str, ignoreNull = true, simpleSplit = true) => {
  // Simple regex split -- this is default behaviour
  const regexSimple = new RegExp(`${match.split(/(\s+)/).filter(h => h.trim()).map(hl => '(' + escapeRegExp(hl) + ')').join('|')}`, 'gi');

  // Split Elivis "The King" Presley into [Elvis, The King, Presley]
  const regex = new RegExp(`${
    match.split(/(?!\B"[^"]*)\s+(?![^"]*"\B)/)
         .filter(h => h.trim())
         .map(quotedSection => {
            if (quotedSection.charAt(0) === '"' && quotedSection.charAt(quotedSection.length - 1) === '"') {
              return quotedSection.slice(1, quotedSection.length - 1);
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
    return [str.split(regexSimple)?.filter(s => s && s.trim()), regexSimple];
  }

  return [str.split(regex)?.filter(s => s && s.trim()), regex];
};

export default matchString;
