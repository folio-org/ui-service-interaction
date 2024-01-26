import { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { FormModal } from '@k-int/stripes-kint-components';

import { useCallout } from '@folio/stripes/core';

import {
  Button,
  Col,
  ConfirmationModal,
  Icon,
  KeyValue,
  Pane,
  PaneHeader,
  Row
} from '@folio/stripes/components';

import {
  ChecksumAlgoInfo,
  CodeInfo,
  EnabledInfo,
  FormatInfo,
  MaximumNumberInfo,
  MaximumNumberThresholdInfo,
  NameInfo,
  NextValueInfo,
  OutputTemplateInfo
} from '../InfoPopovers';

import { useMutateNumberGeneratorSequence, useNumberGeneratorSequence } from '../../public';
import NumberGeneratorSequenceForm from './NumberGeneratorSequenceForm';

const NumberGeneratorSequence = ({
  match: { params: { seqId } },
  onClose,
}) => {
  const callout = useCallout();
  const { data: sequence = {} } = useNumberGeneratorSequence({
    id: seqId,
    queryOptions: {
      enabled: !!seqId
    }
  });

  const [editing, setEditing] = useState(false);
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState(false);

  const {
    put: editSeq,
    delete: removeSeq
  } = useMutateNumberGeneratorSequence({
    afterQueryCalls: {
      delete: () => {
        callout.sendCallout({
          message: <FormattedMessage
            id="ui-service-interaction.settings.numberGeneratorSequences.callout.delete"
            values={{ name: sequence?.name }}
          />
        });
      },
      put: (putValues) => {
        setEditing(false);
        callout.sendCallout({
          message: <FormattedMessage
            id="ui-service-interaction.settings.numberGeneratorSequences.callout.edit"
            values={{ name: putValues?.sequences?.find(s => s.id === sequence.id)?.name }}
          />
        });
      },
    },
    id: sequence?.owner?.id
  });

  const actionMenu = useCallback(() => (
    [
      <Button
        key="action-edit-sequence"
        buttonStyle="dropdownItem"
        marginBottom0
        onClick={() => setEditing(true)}
      >
        <Icon icon="edit">
          <FormattedMessage id="ui-service-interaction.edit" />
        </Icon>
      </Button>,
      <Button
        key="action-delete-sequence"
        buttonStyle="dropdownItem"
        marginBottom0
        onClick={() => setShowDeleteConfirmationModal(true)}
      >
        <Icon icon="trash">
          <FormattedMessage id="ui-service-interaction.delete" />
        </Icon>
      </Button>
    ]
  ), [setEditing]);

  return (
    <>
      <Pane
        defaultWidth="fill"
        renderHeader={(renderProps) => (
          <PaneHeader
            {...renderProps}
            actionMenu={actionMenu}
            dismissible
            onClose={onClose}
            paneTitle={sequence.name ?? sequence.code}
          />
        )}
      >
        <Row>
          <Col xs={6}>
            <KeyValue
              label={
                <>
                  <FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.name" />
                  <NameInfo />
                </>
              }
              value={sequence.name}
            />
          </Col>
          <Col xs={6}>
            <KeyValue
              label={
                <>
                  <FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.code" />
                  <CodeInfo />
                </>
              }
              value={sequence.code}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={6}>
            <KeyValue
              label={
                <>
                  <FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.enabled" />
                  <EnabledInfo />
                </>
              }
              value={sequence.enabled ? <FormattedMessage id="ui-service-interaction.true" /> : <FormattedMessage id="ui-service-interaction.false" />}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={6}>
            <KeyValue
              label={
                <>
                  <FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.maximumNumber" />
                  <MaximumNumberInfo />
                </>
              }
              value={sequence.maximumNumber}
            />
          </Col>
          <Col xs={6}>
            <KeyValue
              label={
                <>
                  <FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.maximumNumberThreshold" />
                  <MaximumNumberThresholdInfo />
                </>
              }
              value={sequence.maximumNumberThreshold}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={6}>
            <KeyValue
              label={
                <>
                  <FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.nextValue" />
                  <NextValueInfo />
                </>
              }
              value={sequence.nextValue}
            />
          </Col>
          <Col xs={6}>
            <KeyValue
              label={
                <>
                  <FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.format" />
                  <FormatInfo />
                </>
              }
              value={sequence.format}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={6}>
            <KeyValue
              label={
                <>
                  <FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.checkDigitAlgo" />
                  <ChecksumAlgoInfo />
                </>
              }
              value={sequence.checkDigitAlgo?.label}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <KeyValue
              label={
                <>
                  <FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.outputTemplate" />
                  <OutputTemplateInfo />
                </>
              }
              value={sequence.outputTemplate}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <KeyValue
              label={<FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.description" />}
              value={sequence.description}
            />
          </Col>
        </Row>
      </Pane>
      {editing &&
        <FormModal
          initialValues={sequence}
          modalProps={{
            dismissible: true,
            label: <FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.editModal" />,
            onClose: () => setEditing(false),
            open: editing
          }}
          onSubmit={editSeq}
        >
          <NumberGeneratorSequenceForm />
        </FormModal>
      }
      <ConfirmationModal
        buttonStyle="danger"
        confirmLabel={
          <FormattedMessage id="ui-service-interaction.delete" />
        }
        heading={
          <FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.deleteSequence" />
        }
        message={[
          <FormattedMessage
            key="delete-sequence-message"
            id="ui-service-interaction.settings.numberGeneratorSequences.deleteSequence.message"
            values={{ name: sequence?.name }}
          />,
          <br key="delete-sequence-line-break" />,
          <FormattedMessage
            key="delete-sequence-warning-message"
            id="ui-service-interaction.settings.numberGeneratorSequences.deleteSequence.warningMessage"
          />
        ]}
        onCancel={() => setShowDeleteConfirmationModal(false)}
        onConfirm={() => {
          removeSeq(sequence?.id);
          onClose();
          setShowDeleteConfirmationModal(false);
        }}
        open={showDeleteConfirmationModal}
      />
    </>
  );
};

NumberGeneratorSequence.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      seqId: PropTypes.string
    }).isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default NumberGeneratorSequence;
