import { useQuery } from 'react-query';
import { useOkapiKy } from '@folio/stripes/core';
import { NUMBER_GENERATOR_SEQUENCE_ENDPOINT } from '../utilities';

const useNumberGeneratorSequence = ({
  id,
  queryOptions = {}
}) => {
  const ky = useOkapiKy();
  return useQuery(
    [NUMBER_GENERATOR_SEQUENCE_ENDPOINT(id), 'ui-service-interaction', id],
    () => ky.get(NUMBER_GENERATOR_SEQUENCE_ENDPOINT(id)).json(),
    queryOptions
  );
};

export default useNumberGeneratorSequence;
