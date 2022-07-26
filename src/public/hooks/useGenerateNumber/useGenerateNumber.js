import { useCallout, useOkapiKy } from '@folio/stripes/core';
import { useIntl } from 'react-intl';
import { useQuery } from 'react-query';
import useNumberGenerators from '../useNumberGenerators';

const useGenerateNumber = ({
  callback = () => null,
  generator, // This is the numberGenerator code
  queryOptions,
  sequence, // This is the sequence code
}) => {
  const callout = useCallout();
  const ky = useOkapiKy();
  const intl = useIntl();

  const { data: { results: { 0: { sequences = [] } = {} } = [] } = {} } = useNumberGenerators(generator);
  // Find full sequence object from DB
  const sequenceObj = sequences.find(seq => seq.code === sequence);
  // If sequence object does not exist at all, allow generation.
  // If sequence object _does_ exist and "enabled" is NOT true, do not allow generation.
  const sequenceEnabled = sequenceObj ? !!sequenceObj.enabled : true;


  const path = `servint/numberGenerators/getNextNumber?generator=${generator}&sequence=${sequence}`;
  const queryObject = useQuery(
    [path, 'ui-service-interaction', 'useGenerateNumber'],
    () => ky.get(path).json().then(res => callback(res?.nextValue)),
    {
      enabled: false,
      cacheTime: 0,
      ...queryOptions
    }
  );

  return ({
    generate: sequenceEnabled ? queryObject.refetch : () => callout.sendCallout({
      message: intl.formatMessage({ id: 'ui-service-interaction.numberGenerator.generateDisabledSequenceError' }),
      type: 'error',
    }),
    queryObject
  });
};

export default useGenerateNumber;
