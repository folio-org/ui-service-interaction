import { FormattedMessage } from 'react-intl';
import { Field, useFormState } from 'react-final-form';

import { composeValidators, required as requiredValidator, useRefdata } from '@k-int/stripes-kint-components';

import {
  Checkbox,
  Col,
  Layout,
  Row,
  Select,
  TextArea,
  TextField
} from '@folio/stripes/components';

import {
  ChecksumAlgoInfo,
  CodeInfo,
  EnabledInfo,
  NextValueInfo,
  OutputTemplateInfo
} from './InfoPopovers';

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
                <CodeInfo />
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
                <NextValueInfo />
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
              <EnabledInfo />
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
                <ChecksumAlgoInfo />
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
                <OutputTemplateInfo />
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
