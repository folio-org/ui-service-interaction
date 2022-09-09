import { FormattedMessage } from 'react-intl';
import { Field, Form, useFormState } from 'react-final-form';

import { composeValidators, required as requiredValidator, useRefdata } from '@k-int/stripes-kint-components';

import { Button, Checkbox, Col, InfoPopover, Layout, Row, Select, TextArea, TextField } from '@folio/stripes/components';


const NumberGeneratorSequenceForm = () => {
  const { values } = useFormState();

  const { 0: { values: checksums = [] } = {} } = useRefdata({
    endpoint: 'servint/refdata',
    desc: 'NumberGeneratorSequence.CheckDigitAlgo'
  });

  // Longer term we will support more of the values than these two
  const currentlySupportedChecksums = [
    'none',
    'ean13'
  ];

  const checkDigitAlgoOptions = [
    { value: '', label: '', disabled: true },
    ...checksums?.filter(cdao => currentlySupportedChecksums.includes(cdao.value))?.map(cdao => ({ value: cdao.id, label: cdao.label }))
  ];

  const validateChecksum = (val, allVal) => {
    const checksumVal = checksums?.find(cs => cs.id === val);
    if (checksumVal?.value && checksumVal.value !== 'none' && allVal.nextValue && parseInt(allVal.nextValue, 10) < 1) {
      return <FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.checksumError" />;
    }

    return null;
  };

  return (
    <>
      <Row>
        <Col xs={6}>
          <Field
            component={TextField}
            disabled={!!values?.id}
            label={
              <>
                <FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.code" />
                <InfoPopover
                  content={
                    <FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.code.info" />
                  }
                />
              </>
            }
            name="code"
            required
            validate={requiredValidator}
          />
        </Col>
        <Col xs={6}>
          <Field
            component={TextField}
            disabled={!!values?.id}
            label={
              <>
                <FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.nextValue" />
                <InfoPopover
                  content={
                    <FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.nextValue.info" />
                  }
                />
              </>
            }
            name="nextValue"
            type="number"
            validate={requiredValidator}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <Layout className="flex">
            <Layout className="margin-end-gutter">
              <InfoPopover
                content={
                  <FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.enabled.info" />
                }
              />
            </Layout>
            <Field
              component={Checkbox}
              defaultValue
              label={<FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.enabled" />}
              name="enabled"
              type="checkbox"
            />
          </Layout>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <Field
            component={TextArea}
            label={<FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.description" />}
            name="description"
            parse={v => v}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={6}>
          <Field
            component={Select}
            dataOptions={checkDigitAlgoOptions}
            fullWidth
            label={
              <>
                <FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.checkDigitAlgo" />
                <InfoPopover
                  content={
                    <FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.checkDigitAlgo.info" />
                  }
                />
              </>
            }
            name="checkDigitAlgo.id" // checkDigitAlgo should deal with the id
            parse={v => v}
            required
            validate={composeValidators(validateChecksum, requiredValidator)}
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
            label={
              <>
                <FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.outputTemplate" />
                <InfoPopover
                  content={
                    <>
                      <Layout>
                        <FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.outputTemplate.info" />
                      </Layout>
                      <Layout>
                        <Button
                          buttonStyle="primary"
                          marginBottom0
                        >
                          <FormattedMessage id="ui-service-interaction.learnMore" />
                        </Button>
                      </Layout>
                    </>
                  }
                />
              </>
            }
            name="outputTemplate"
            parse={v => v}
          />
        </Col>
      </Row>
    </>
  );
};

export default NumberGeneratorSequenceForm;
