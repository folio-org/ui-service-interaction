/* eslint-disable no-template-curly-in-string */
// In these cases the "template" is actually the suggestion

const BASE_TEMPLATE = '${generated_number}';
const ISSN_TEMPLATE = '${generated_number.substring(0,4)}-${generated_number.substring(4,7)}${checksum}';
const ISBN10_TEMPLATE = '${generated_number.substring(0,1)}-${generated_number.substring(1,4)}-${generated_number.substring(4,9)}-${checksum}';

export {
  BASE_TEMPLATE,
  ISSN_TEMPLATE,
  ISBN10_TEMPLATE
};

