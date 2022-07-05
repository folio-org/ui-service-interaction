import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Pane } from '@folio/stripes/components';
import { ActionList } from '@k-int/stripes-kint-components';

import { useNumberGenerators, useMutateNumberGenerator } from '../public';

const NumberGeneratorConfig = ({
  history,
  match
}) => {
  const { data: { results: data = [] } = {} } = useNumberGenerators();

  const {
    put: editNumberGenerator,
    post: addNumberGenerator,
    delete: removeNumberGenerator
  } = useMutateNumberGenerator();

  const actionAssigner = (rowData) => {
    const actionArray = [
      {
        name: 'edit',
        label: <FormattedMessage id="ui-service-interaction.settings.numberGenerator.edit" />,
        icon: 'edit',
        callback: (newData) => editNumberGenerator(newData)
      }
    ];

    if (!rowData?.sequences?.length) {
      actionArray.push({
        name: 'delete',
        callback: (rd) => removeNumberGenerator(rd?.id),
        icon: 'trash'
      });
    }

    return actionArray;
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
          creatableFields={{
            sequences: () => false
          }}
          createCallback={(ng) => addNumberGenerator(ng)}
          editableFields={{
            code: () => false,
            sequences: () => false
          }}
          formatter={{
            sequences: (rowData) => (
              rowData?.sequences?.length
            )
          }}
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
