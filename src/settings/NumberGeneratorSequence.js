import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Button, Col, Icon, KeyValue, Pane, Row } from '@folio/stripes/components';

const NumberGeneratorSequence = ({
  onClose,
  removeSeq,
  sequence,
  setEditing,
}) => {
  console.log("SEQ: %o", sequence);

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
              onClick={() => {
                removeSeq(sequence.id);
                onClose();
              }}
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
              label={<FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.checkDigitAlgo" />}
              value={sequence.checkDigitAlgo?.label}
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
          <Col xs={6}>
            <KeyValue
              label={<FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.outputTemplate" />}
              value={sequence.outputTemplate}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={6}>
            <KeyValue
              label={<FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.prefix" />}
              value={sequence.prefix}
            />
          </Col>
          <Col xs={6}>
            <KeyValue
              label={<FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.postfix" />}
              value={sequence.postfix}
            />
          </Col>
        </Row>
      </Pane>
    </>
  );
};

NumberGeneratorSequence.propTypes = {
  onClose: PropTypes.func.isRequired,
  removeSeq: PropTypes.func.isRequired,
  sequence: PropTypes.shape({
    code: PropTypes.string.isRequired,
    checkDigitAlgo: PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string
    }),
    format: PropTypes.string,
    id: PropTypes.string.isRequired,
    outputTemplate: PropTypes.string,
    postfix: PropTypes.string,
    prefix: PropTypes.string
  }).isRequired,
  setEditing: PropTypes.func.isRequired
};

export default NumberGeneratorSequence;
