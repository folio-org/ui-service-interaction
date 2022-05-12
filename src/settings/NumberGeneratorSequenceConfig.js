import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Pane } from '@folio/stripes/components';
import { ActionList } from '@k-int/stripes-kint-components';

import { useNumberGenerators } from '../public';
import { useMutateNumberGeneratorSequence } from '../public/hooks';

const NumberGeneratorSequenceConfig = ({
  history,
  location,
  match
}) => {
  const { data: { results: data = [] } = {}, isLoading } = useNumberGenerators();
  const [numberGenerator, setNumberGenerator] = useState();
  console.log("NG: %o", numberGenerator);

  console.log("DATA: %o", data);

  // Once data has loaded, default selected number generator to top of list
  useEffect(() => {
    if (!isLoading && data?.length) {
      setNumberGenerator(data[0]);
    }
  }, [data, isLoading]);

  const {
    put: editSeq,
  } = useMutateNumberGeneratorSequence({
    id: numberGenerator?.id
  });

  const actionAssigner = () => ([
    {
      name: 'edit',
      label: <FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.edit" />,
      icon: 'edit',
      callback: (newData) => editSeq(newData)
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
        <ActionList
          actionAssigner={actionAssigner}
          contentData={numberGenerator?.sequences?.sort((a, b) => (
            a.code > b.code ? -1 : (a.code < b.code ? 1 : 0)
          ))}
          editableFields={{
            code: () => false,
            nextValue: () => false
          }}
          formatter={{
            nextValue: (rowData) => (
              rowData.nextValue ?? 0
            )
          }}
          hideCreateButton
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
