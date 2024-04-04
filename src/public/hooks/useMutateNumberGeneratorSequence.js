import { useMutation, useQueryClient } from 'react-query';
import { useOkapiKy } from '@folio/stripes/core';

import { NUMBER_GENERATORS_ENDPOINT, NUMBER_GENERATOR_ENDPOINT, NUMBER_GENERATOR_SEQUENCES_ENDPOINT, NUMBER_GENERATOR_SEQUENCE_ENDPOINT } from '../constants';

// We _could_ do this directly with the newer endpoint, but this way works *shrug*
const useMutateNumberGeneratorSequence = ({
  afterQueryCalls,
  catchQueryCalls,
  id, // This is the ID of the parent NumberGenerator
  queryParams,
  returnQueryObject = {
    // Technically all three of these are PUT calls, but keeping these like this to provide usability
    post: false,
    put: false,
    delete: false
  }
} = {}) => {
  const returnObj = {};
  const queryClient = useQueryClient();
  const ky = useOkapiKy();

  const invalidateNumberGenerators = () => queryClient.invalidateQueries(NUMBER_GENERATORS_ENDPOINT);
  const invalidateNumberGeneratorSequences = () => queryClient.invalidateQueries(NUMBER_GENERATOR_SEQUENCES_ENDPOINT);
  const invalidateNumberGeneratorSequence = (invalidateId) => queryClient.invalidateQueries(NUMBER_GENERATOR_SEQUENCE_ENDPOINT(invalidateId));

  // DELETE SEQ
  const deleteQueryObject = useMutation(
    ['ui-service-interaction', 'useMutateNumberGeneratorSequence', 'deleteSeq', id],
    async (seqId) => ky.put(
      NUMBER_GENERATOR_ENDPOINT(id),
      {
        json: {
          id,
          sequences: [
            {
              id: seqId,
              _delete: true
            }
          ]
        }
      }
    ).json()
      .then((res) => {
        invalidateNumberGenerators();
        invalidateNumberGeneratorSequences();
        return res;
      })
      .then(afterQueryCalls?.delete)
      .catch(catchQueryCalls?.delete),
    queryParams?.delete
  );

  // Edit Seq
  const putQueryObject = useMutation(
    ['ui-service-interaction', 'useMutateNumberGeneratorSequence', 'editSeq', id],
    async (data) => ky.put(
      NUMBER_GENERATOR_ENDPOINT(id),
      {
        json: {
          id,
          sequences: [
            data // These are additive, so this shouldn't delete the others
          ]
        }
      }
    ).json()
      .then((res) => {
        invalidateNumberGenerators();
        invalidateNumberGeneratorSequences();
        invalidateNumberGeneratorSequence(data.id);
        return res;
      })
      .then(res => afterQueryCalls?.put(res, data))
      .catch(res => catchQueryCalls?.put(res, data)),
    queryParams?.put
  );

  // Create seq
  // This is functionally the same as edit Seq, but keeping it separate allows separate afterQueryCalls
  const postQueryObject = useMutation(
    ['ui-service-interaction', 'useMutateNumberGeneratorSequence', 'addSeq', id],
    async (data) => ky.put(
      NUMBER_GENERATOR_ENDPOINT(id),
      {
        json: {
          id,
          sequences: [
            data
          ]
        }
      }
    ).json()
      .then((res) => {
        invalidateNumberGenerators();
        invalidateNumberGeneratorSequences();
        return res;
      })
      .then(res => afterQueryCalls?.post(res, data))
      .catch(res => catchQueryCalls?.post(res, data)),
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

export default useMutateNumberGeneratorSequence;
