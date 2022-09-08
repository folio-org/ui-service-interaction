import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Button, Col, Icon, KeyValue, Pane, Row } from '@folio/stripes/components';

const NumberGeneratorSequence = ({
  onClose,
  onDelete,
  sequence,
  setEditing,
}) => {
  return (
    <>
      <Pane
        actionMenu={() => (
          [
            <Button
              buttonStyle="dropdownItem"
              marginBottom0
              onClick={() => setEditing()}
            >
              <Icon icon="edit">
                <FormattedMessage id="ui-service-interaction.edit" />
              </Icon>
            </Button>,
            <Button
              buttonStyle="dropdownItem"
              marginBottom0
              onClick={onDelete}
            >
              <Icon icon="trash">
                <FormattedMessage id="ui-service-interaction.delete" />
              </Icon>
            </Button>
          ]
        )}
        defaultWidth="fill"
        dismissible
        onClose={onClose}
        paneTitle={sequence.code}
      >
        <Row>
          <Col xs={6}>
            <KeyValue
              label={<FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.code" />}
              value={sequence.code}
            />
          </Col>
          <Col xs={6}>
            <KeyValue
              label={<FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.nextValue" />}
              value={sequence.nextValue}
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
              label={<FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.checkDigitAlgo" />}
              value={sequence.checkDigitAlgo?.label}
            />
          </Col>
          <Col xs={6}>
            <KeyValue
              label={<FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.enabled" />}
              value={sequence.enabled ? <FormattedMessage id="ui-service-interaction.true" /> : <FormattedMessage id="ui-service-interaction.false" />}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={6}>
            <KeyValue
              label={<FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.format" />}
              value={sequence.format}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <KeyValue
              label={<FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.outputTemplate" />}
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
    nextValue: PropTypes.number,
    outputTemplate: PropTypes.string,
  }).isRequired,
  setEditing: PropTypes.func.isRequired
};

export default NumberGeneratorSequence;
