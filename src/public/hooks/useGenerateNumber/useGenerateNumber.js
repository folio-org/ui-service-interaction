import { useOkapiKy } from '@folio/stripes/core';
import { useQuery } from 'react-query';

const useGenerateNumber = ({
  callback = () => null,
  generator, // This is the numberGenerator code
  queryOptions,
  sequence, // This is the sequence code
}) => {
  const ky = useOkapiKy();

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
    generate: queryObject.refetch,
    queryObject
  });
};

export default useGenerateNumber;
