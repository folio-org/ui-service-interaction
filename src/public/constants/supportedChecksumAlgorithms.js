// I'd like a smarter way to do this in future, potentially "custom" checksums set up by the users.
// Ordering matters here, as it will be reflected in the dropdown (for now)
export default [
  'none',
  'luhncheckdigit',
  'ean13',
  '12_ltr_mod10_r',
  '1793_ltr_mod10_r',
  'issncheckdigit',
  'isbn10checkdigit',
];
