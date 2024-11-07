import refdata from '../../../../test/jest/refdata';

module.exports = ({ desc }) => {
  if (desc && Array.isArray(desc)) {
    return refdata?.filter(rdc => desc.contains(rdc.desc));
  } else if (desc && typeof desc === 'string') {
    return refdata?.filter(rdc => rdc.desc === desc);
  }
  return refdata;
};
