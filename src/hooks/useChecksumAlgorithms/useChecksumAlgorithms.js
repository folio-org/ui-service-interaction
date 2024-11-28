import { useCallback, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';

import { supportedChecksumAlgorithms } from '../../public';

import useSIRefdata from '../useSIRefdata';

const useChecksumAlgorithms = () => {
  const { 0: { values: checksums = [] } = {} } = useSIRefdata({
    desc: 'NumberGeneratorSequence.CheckDigitAlgo',
  });

  // Neatly selectify from id.
  const checkDigitAlgoOptions = useMemo(() => (
    // Grab only supported checksum algorithms that mainfest in backend returned shape
    supportedChecksumAlgorithms.map(sca => {
      const cdao = checksums.find(cs => cs.value === sca);

      if (!cdao) { return null; }

      return ({
        value: cdao.id,
        label: cdao.label
      });
    }).filter(Boolean)
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

