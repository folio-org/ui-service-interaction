import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Pane, Select } from '@folio/stripes/components';
import { ActionList } from '@k-int/stripes-kint-components';

import { useNumberGenerators } from '../public';
import { useMutateNumberGeneratorSequence } from '../public/hooks';

const NumberGeneratorSequenceConfig = ({
  history,
  match
}) => {
  const { data: { results: data = [] } = {}, isLoading } = useNumberGenerators();
  const [numberGenerator, setNumberGenerator] = useState({});

  const findNumberGenerator = (ngId) => {
    return data?.find(ng => ng?.id === ngId);
  };

  // Once data has loaded, default selected number generator to top of list
  useEffect(() => {
    if (!numberGenerator?.id && !isLoading && data?.length) {
      setNumberGenerator(data[0]);
    }
  }, [data, isLoading, numberGenerator]);

  const {
    put: editSeq,
    post: addSeq,
    delete: removeSeq
  } = useMutateNumberGeneratorSequence({
    id: numberGenerator?.id
  });

  const actionAssigner = () => ([
    {
      name: 'edit',
      label: <FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.edit" />,
      icon: 'edit',
      callback: (newData) => editSeq(newData)
    },
    {
      name: 'delete',
      callback: (rowData) => removeSeq(rowData?.id),
      icon: 'trash'
    }
  ]);

  return (
    <>
      <Pane
        defaultWidth="fill"
        dismissible
        id="settings-numberGeneratorSequences-list"
        onClose={() => history.push(match.url)}
        paneTitle={<FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences" />}
      >
        <Select
          dataOptions={[...data?.map(ng => ({ value: ng.id, label: ng.name }))]}
          onChange={e => setNumberGenerator(findNumberGenerator(e.target.value))}
          value={numberGenerator.id}
        />
        <ActionList
          actionAssigner={actionAssigner}
          contentData={numberGenerator?.sequences?.sort((a, b) => {
            if (a.code > b.code) {
              return 1;
            }

            if (b.code > a.code) {
              return -1;
            }

            return 0;
          })}
          createCallback={(ngSeq) => addSeq(ngSeq)}
          editableFields={{
            code: () => false,
            nextValue: () => false
          }}
          formatter={{
            nextValue: (rowData) => (
              rowData.nextValue ?? 0
            )
          }}
          visibleFields={['code', 'prefix', 'postfix', 'nextValue']}
        />
      </Pane>
    </>
  );
};

NumberGeneratorSequenceConfig.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }),
  location: PropTypes.shape({
    pathName: PropTypes.string.isRequired
  }),
  match: PropTypes.shape({
    url: PropTypes.string.isRequired
  })
};

export default NumberGeneratorSequenceConfig;
