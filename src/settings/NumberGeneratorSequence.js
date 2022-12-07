import { useCallback } from 'react';

import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  Col,
  Icon,
  KeyValue,
  Pane,
  Row
} from '@folio/stripes/components';

import {
  ChecksumAlgoInfo,
  CodeInfo,
  EnabledInfo,
  FormatInfo,
  NameInfo,
  NextValueInfo,
  OutputTemplateInfo
} from './InfoPopovers';

const NumberGeneratorSequence = ({
  onClose,
  onDelete,
  sequence,
  setEditing,
}) => {
  const actionMenu = useCallback(() => (
    [
      <Button
        key="action-edit-sequence"
        buttonStyle="dropdownItem"
        marginBottom0
        onClick={setEditing}
      >
        <Icon icon="edit">
          <FormattedMessage id="ui-service-interaction.edit" />
        </Icon>
      </Button>,
      <Button
        key="action-delete-sequence"
        buttonStyle="dropdownItem"
        marginBottom0
        onClick={onDelete}
      >
        <Icon icon="trash">
          <FormattedMessage id="ui-service-interaction.delete" />
        </Icon>
      </Button>
    ]
  ), [onDelete, setEditing]);

  return (
    <>
      <Pane
        actionMenu={actionMenu}
        defaultWidth="fill"
        dismissible
        onClose={onClose}
        paneTitle={sequence.name ?? sequence.code}
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
          <Col xs={12}>
            <KeyValue
              label={<FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.description" />}
              value={sequence.description}
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
      </Pane>
    </>
  );
};

NumberGeneratorSequence.propTypes = {
  onClose: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  sequence: PropTypes.shape({
    code: PropTypes.string.isRequired,
    checkDigitAlgo: PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string
    }),
    description: PropTypes.string,
    enabled: PropTypes.bool,
    format: PropTypes.string,
    id: PropTypes.string.isRequired,
    name: PropTypes.string,
    nextValue: PropTypes.number,
    outputTemplate: PropTypes.string,
  }).isRequired,
  setEditing: PropTypes.func.isRequired
};

export default NumberGeneratorSequence;
