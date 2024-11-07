import { useCallback, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';

import useSIRefdata from '../useSIRefdata';
import { supportedChecksumAlgorithms } from '../../constants';

const useChecksumAlgorithms = () => {
  const { 0: { values: checksums = [] } = {} } = useSIRefdata({
    desc: 'NumberGeneratorSequence.CheckDigitAlgo',
  });

  // Neatly selectify from id.
  const checkDigitAlgoOptions = useMemo(() => (
    checksums?.filter(cdao => (
      supportedChecksumAlgorithms.includes(cdao.value)
    ))?.map(cdao => ({
      value: cdao.id,
      label: cdao.label
    })) ?? []
  ), [checksums]);

  // Helpful checksum validator
  const validateChecksum = useCallback((val, allVal) => {
    const checksumVal = checksums?.find(cs => cs.id === val);
    if (checksumVal?.value && checksumVal.value !== 'none' && allVal.nextValue && parseInt(allVal.nextValue, 10) < 1) {
      return <FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.checksumError" />;
    }

    return null;
  }, [checksums]);

  const noneChecksumId = useMemo(() => checksums.find(cs => cs.value === 'none')?.id, [checksums]);

  return ({
    checkDigitAlgoOptions,
    checksums,
    noneChecksumId, // Special case deserves its own export
    validateChecksum
  });
};

export default useChecksumAlgorithms;

