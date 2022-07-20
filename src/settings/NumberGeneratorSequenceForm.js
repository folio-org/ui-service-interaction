import { FormattedMessage } from 'react-intl';
import { Field, useFormState } from 'react-final-form';

import { required as requiredValidator, useRefdata } from '@k-int/stripes-kint-components';

import { Col, Row, Select, TextArea, TextField } from '@folio/stripes/components';


const NumberGeneratorSequenceForm = () => {
  const { values } = useFormState();

  const { 0: { values: checkDigitAlgoOptions = [] } = {} } = useRefdata({
    endpoint: 'servint/refdata',
    desc: 'NumberGeneratorSequence.CheckDigitAlgo'
  });

  // Longer term we will support more of the values than these two
  const currentlySupportedChecksums = [
    'none',
    'ean13'
  ];

  return (
    <>
      <Row>
        <Col xs={6}>
          <Field
            component={TextField}
            disabled={!!values?.id}
            label={<FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.code" />}
            name="code"
            required
            validate={requiredValidator}
          />
        </Col>
        <Col xs={6}>
          <Field
            component={TextField}
            disabled={!!values?.id}
            label={<FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.nextValue" />}
            name="nextValue"
            type="number"
          />
        </Col>
      </Row>
      <Row>
        <Col xs={6}>
          <Field
            component={Select}
            dataOptions={[
              { value: '', label: '', disabled: true },
              ...checkDigitAlgoOptions?.filter(cdao => currentlySupportedChecksums.includes(cdao.value))?.map(cdao => ({ value: cdao.id, label: cdao.label }))
            ]}
            fullWidth
            label={<FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.checkDigitAlgo" />}
            name="checkDigitAlgo.id" // checkDigitAlgo should deal with the id
            parse={v => v}
            required
            validate={requiredValidator}
          />
        </Col>
        <Col xs={6}>
          <Field
            component={TextField}
            label={<FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.format" />}
            name="format"
            parse={v => v}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <Field
            component={TextArea}
            label={<FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.outputTemplate" />}
            name="outputTemplate"
            parse={v => v}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={6}>
          <Field
            component={TextField}
            label={<FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.prefix" />}
            name="prefix"
            parse={v => v}
          />
        </Col>
        <Col xs={6}>
          <Field
            component={TextField}
            label={<FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.postfix" />}
            name="postfix"
            parse={v => v}
          />
        </Col>
      </Row>
    </>
  );
};

export default NumberGeneratorSequenceForm;
