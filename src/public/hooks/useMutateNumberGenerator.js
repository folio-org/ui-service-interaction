import { useMutation, useQueryClient } from 'react-query';
import { useOkapiKy } from '@folio/stripes/core';

import { NUMBER_GENERATORS_ENDPOINT, NUMBER_GENERATOR_ENDPOINT } from '../utilities/endpoints';

const useMutateNumberGenerator = ({
  afterQueryCalls,
  queryParams,
  returnQueryObject = {
    post: false,
    put: false,
    delete: false
  }
}) => {
  const returnObj = {};
  const queryClient = useQueryClient();
  const ky = useOkapiKy();

  const invalidateNumberGenerators = () => queryClient.invalidateQueries(NUMBER_GENERATORS_ENDPOINT);

  // DELETE Number generator
  const deleteQueryObject = useMutation(
    ['ui-service-interaction', 'useMutateNumberGenerator', 'delete'],
    async (genId) => ky.delete(NUMBER_GENERATOR_ENDPOINT(genId)).json()
      .then(afterQueryCalls?.delete)
      .then(() => invalidateNumberGenerators()),
    queryParams?.delete
  );

  // Edit Number generator
  const putQueryObject = useMutation(
    ['ui-service-interaction', 'useMutateNumberGenerator', 'edit'],
    async (data) => ky.put(NUMBER_GENERATOR_ENDPOINT(data?.id), { json: data }).json()
      .then(afterQueryCalls?.put)
      .then(() => invalidateNumberGenerators()),
    queryParams?.put
  );

  // Create number generator
  const postQueryObject = useMutation(
    ['ui-service-interaction', 'useMutateNumberGenerator', 'add'],
    async (data) => ky.post(NUMBER_GENERATORS_ENDPOINT, { json: data }).json()
      .then(afterQueryCalls?.post)
      .then(() => invalidateNumberGenerators()),
    queryParams?.post
  );

  if (returnQueryObject?.delete) {
    returnObj.delete = deleteQueryObject;
  } else {
    returnObj.delete = deleteQueryObject.mutateAsync;
  }

  if (returnQueryObject?.put) {
    returnObj.put = putQueryObject;
  } else {
    returnObj.put = putQueryObject.mutateAsync;
  }

  if (returnQueryObject?.post) {
    returnObj.post = postQueryObject;
  } else {
    returnObj.post = postQueryObject.mutateAsync;
  }

  return returnObj;
};

export default useMutateNumberGenerator;
