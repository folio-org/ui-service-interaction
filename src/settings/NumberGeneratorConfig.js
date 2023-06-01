import { useState } from 'react';

import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { useCallout } from '@folio/stripes/core';
import { Button, ConfirmationModal, InfoPopover, MessageBanner, Pane } from '@folio/stripes/components';
import { ActionList } from '@k-int/stripes-kint-components';

import { useNumberGenerators, useMutateNumberGenerator } from '../public';

const NumberGeneratorConfig = ({
  history,
  match
}) => {
  const { data: { results: data = [] } = {} } = useNumberGenerators();

  const callout = useCallout();

  const [removeGenerator, setRemoveGenerator] = useState();

  const {
    put: editNumberGenerator,
    post: addNumberGenerator,
    delete: removeNumberGenerator
  } = useMutateNumberGenerator({
    afterQueryCalls: {
      delete: () => {
        callout.sendCallout({
          message: <FormattedMessage
            id="ui-service-interaction.settings.numberGenerators.callout.delete"
            values={{ name: removeGenerator?.label ?? removeGenerator?.code }}
          />
        });
      },
      put: (res) => {
        callout.sendCallout({
          message: <FormattedMessage
            id="ui-service-interaction.settings.numberGenerators.callout.edit"
            values={{ name: res.label ?? res.code }}
          />
        });
      },
      post: (res) => {
        callout.sendCallout({
          message: <FormattedMessage
            id="ui-service-interaction.settings.numberGenerators.callout.create"
            values={{ name: res.label ?? res.code }}
          />
        });
      },
    }
  });

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
        callback: (rd) => setRemoveGenerator(rd),
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
        <MessageBanner>
          <FormattedMessage
            id="ui-service-interaction.settings.numberGenerators.helpText"
            values={{
              helpDocumentationLink: (
                <a href="https://wiki.folio.org/display/FOLIOtips/Number+generator">
                  <FormattedMessage id="ui-service-interaction.settings.numberGenerators.helpDocumentationLink" />
                </a>
              )
            }}
          />
        </MessageBanner>
        <ActionList
          actionAssigner={actionAssigner}
          columnMapping={{
            name:
              // eslint-disable-next-line react/jsx-indent
              <>
                <FormattedMessage id="ui-service-interaction.settings.numberGenerators.name" />
                <InfoPopover
                  content={<FormattedMessage id="ui-service-interaction.settings.numberGenerators.name.info" />}
                />
              </>,
            code:
              // eslint-disable-next-line react/jsx-indent
              <>
                <FormattedMessage id="ui-service-interaction.settings.numberGenerators.code" />
                <InfoPopover
                  content={<FormattedMessage id="ui-service-interaction.settings.numberGenerators.code.info" />}
                />
              </>,
            sequences:
              // eslint-disable-next-line react/jsx-indent
              <>
                <FormattedMessage id="ui-service-interaction.settings.numberGenerators.sequences" />
                <InfoPopover
                  content={<FormattedMessage id="ui-service-interaction.settings.numberGenerators.sequences.info" />}
                />
              </>,
          }}
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
          label={<FormattedMessage id="ui-service-interaction.settings.numberGenerators" />}
          visibleFields={['name', 'code', 'sequences']}
        />
      </Pane>
      <ConfirmationModal
        buttonStyle="danger"
        confirmLabel={
          <FormattedMessage id="ui-service-interaction.delete" />
        }
        heading={
          <FormattedMessage id="ui-service-interaction.settings.numberGenerators.deleteGenerator" />
        }
        message={
          <FormattedMessage id="ui-service-interaction.settings.numberGenerators.deleteGenerator.message" values={{ name: removeGenerator?.label ?? removeGenerator?.code }} />
        }
        onCancel={() => setRemoveGenerator()}
        onConfirm={() => {
          removeNumberGenerator(removeGenerator?.id);
          setRemoveGenerator();
        }}
        open={!!removeGenerator?.id}
      />
    </>
  );
};

NumberGeneratorConfig.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }),
  location: PropTypes.shape({
    pathName: PropTypes.string
  }),
  match: PropTypes.shape({
    url: PropTypes.string.isRequired
  })
};

export default NumberGeneratorConfig;
