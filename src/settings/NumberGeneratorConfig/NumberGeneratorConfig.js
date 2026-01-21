import { useState } from 'react';

import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';

import { useCallout, useStripes } from '@folio/stripes/core';
import { ConfirmationModal, InfoPopover, MessageBanner, Pane } from '@folio/stripes/components';
import { ActionList, required } from '@k-int/stripes-kint-components';

import { useNumberGenerators, useMutateNumberGenerator } from '../../public';

const NumberGeneratorConfig = ({
  baseUrl,
  history,
}) => {
  const { data: { results: data = [] } = {} } = useNumberGenerators();
  const intl = useIntl();
  const stripes = useStripes();
  const hasManagePerm = stripes.hasPerm('ui-service-interaction.numberGenerator.manage');
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
        ariaLabel: intl.formatMessage(
          { id: 'ui-service-interaction.settings.numberGenerators.editGeneratorAria' },
          { name: rowData?.name }
        ),
        name: 'edit',
        label: <FormattedMessage id="ui-service-interaction.settings.numberGenerator.edit" />,
        icon: 'edit',
        callback: (newData) => editNumberGenerator(newData)
      }
    ];

    if (!rowData?.sequences?.length) {
      actionArray.push({
        ariaLabel: intl.formatMessage(
          { id: 'ui-service-interaction.settings.numberGenerators.deleteGeneratorAria' },
          { name: rowData?.name }
        ),
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
        onClose={() => history.push(baseUrl)}
        paneTitle={<FormattedMessage id="ui-service-interaction.settings.numberGenerators" />}
      >
        <MessageBanner>
          <FormattedMessage
            id="ui-service-interaction.settings.numberGenerators.helpText"
            values={{
              helpDocumentationLink: (
                <a
                  href="https://docs.folio.org/docs/settings/settings_service_interaction/settings_service_interaction/"
                  rel="noreferrer"
                  target="_blank"
                >
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
          hideActionsColumn={!hasManagePerm}
          hideCreateButton={!hasManagePerm}
          label={<FormattedMessage id="ui-service-interaction.settings.numberGenerators" />}
          validateFields={{
            name: () => required,
            code: () => required
          }}
          visibleFields={['name', 'code', 'sequences']}
        />
      </Pane>
      <ConfirmationModal
        buttonStyle="danger"
        confirmLabel={
          <FormattedMessage id="ui-service-interaction.delete" />
        }
        heading={
          intl.formatMessage({ id: 'ui-service-interaction.settings.numberGenerators.deleteGenerator' })
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
  baseUrl: PropTypes.string,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }),
  location: PropTypes.shape({
    pathName: PropTypes.string
  }),
};

export default NumberGeneratorConfig;
