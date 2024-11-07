import { useCallback, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';

import useSIRefdata from '../useSIRefdata';

const useChecksumAlgorithms = () => {
  const { 0: { values: checksums = [] } = {} } = useSIRefdata({
    desc: 'NumberGeneratorSequence.CheckDigitAlgo',
  });

  // I'd like a smarter way to do this in future, potentially "custom" checksums set up by the users.
  const currentlySupportedChecksums = useMemo(() => [
    'none',
    'ean13',
    'isbn10checkdigit',
    'luhncheckdigit',
    '1793_ltr_mod10_r',
    '12_ltr_mod10_r',
    'issncheckdigit'
  ], []);


  // Neatly selectify from id.
  const checkDigitAlgoOptions = useMemo(() => (
    checksums?.filter(cdao => (
      currentlySupportedChecksums.includes(cdao.value)
    ))?.map(cdao => ({
      value: cdao.id,
      label: cdao.label
    })) ?? []
  ), [checksums, currentlySupportedChecksums]);

  // Helpful checksum validator
  const validateChecksum = useCallback((val, allVal) => {
    const checksumVal = checksums?.find(cs => cs.id === val);
    if (checksumVal?.value && checksumVal.value !== 'none' && allVal.nextValue && parseInt(allVal.nextValue, 10) < 1) {
      return <FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.checksumError" />;
    }

    return null;
  }, [checksums]);

  return ({
    checkDigitAlgoOptions,
    checksums,
    currentlySupportedChecksums,
    validateChecksum
  });
};

export default useChecksumAlgorithms;

