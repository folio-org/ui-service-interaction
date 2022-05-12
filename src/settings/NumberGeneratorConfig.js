import { useState } from 'react';
import PropTypes, { number } from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Pane } from '@folio/stripes/components';
import { ActionList } from '@k-int/stripes-kint-components';

import { useNumberGenerators, useMutateNumberGenerator } from '../public';

const NumberGeneratorConfig = ({
  history,
  location,
  match
}) => {
  const { data: { results: data = [] } = {}, isLoading } = useNumberGenerators();
  console.log("DATA: %o", data);

  const {
    put: editNumberGenerator,
  } = useMutateNumberGenerator();

  const actionAssigner = () => {
    return [
      {
        name: 'delete',
        callback: () => {
          alert("should delete number generator")
        },
        icon: 'trash'
      }
    ];
  };

  return (
    <>
      <Pane
        defaultWidth="fill"
        dismissible
        id="settings-numberGenerators-list"
        onClose={() => history.push(match.url)}
        paneTitle={<FormattedMessage id="ui-service-interaction.settings.numberGenerators" />}
      >
        <ActionList
          actionAssigner={actionAssigner}
          contentData={data}
          editableFields={{
            'code': () => false,
            'sequences': () => false
          }}
          formatter={{
            sequences: (rowData) => (
              rowData?.sequences?.length
            )
          }}
          hideCreateButton
          visibleFields={['name', 'code', 'sequences']}
        />
      </Pane>
    </>
  );
};

NumberGeneratorConfig.propTypes = {
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

export default NumberGeneratorConfig;
