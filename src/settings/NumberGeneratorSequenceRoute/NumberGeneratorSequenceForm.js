import { FormattedMessage } from 'react-intl';
import { Field, useFormState } from 'react-final-form';

import { composeValidators, required as requiredValidator } from '@k-int/stripes-kint-components';

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
  FormatInfo,
  MaximumNumberInfo,
  MaximumNumberThresholdInfo,
  NameInfo,
  NextValueInfo,
  OutputTemplateInfo
} from '../InfoPopovers';
import useSIRefdata from '../../hooks/useSIRefdata';
import { useCallback } from 'react';

const NumberGeneratorSequenceForm = () => {
  const { values } = useFormState();

  const { 0: { values: checksums = [] } = {} } = useSIRefdata({
    desc: 'NumberGeneratorSequence.CheckDigitAlgo',
  });

  // Longer term we will support more of the values than these two
  const currentlySupportedChecksums = [
    'none',
    'ean13'
  ];

  const checkDigitAlgoOptions = [
    { value: '', label: '', disabled: true },
    ...checksums?.filter(cdao => currentlySupportedChecksums.includes(cdao.value))?.map(cdao => ({ value: cdao.id, label: cdao.label })) ?? []
  ];

  const validateChecksum = (val, allVal) => {
    const checksumVal = checksums?.find(cs => cs.id === val);
    if (checksumVal?.value && checksumVal.value !== 'none' && allVal.nextValue && parseInt(allVal.nextValue, 10) < 1) {
      return <FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.checksumError" />;
    }

    return null;
  };

  const validateMaximumNumber = (val, allVal) => {
    if (!!val && val > parseInt('9'.repeat(allVal.format?.length ?? 1), 10)) {
      return <FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.maximumNumber.maximumTooLow" />;
    }

    return null;
  };

  const validateMaximumNumberThreshold = (val, allVal) => {
    if (!allVal.maximumNumber && !!val) {
      return <FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.maximumNumberThreshold.thresholdNoMaximum" />;
    }

    if (!!allVal.maximumNumber && !!val && parseInt(val, 10) >= parseInt(allVal.maximumNumber, 10)) {
      return <FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.maximumNumberThreshold.thresholdMustBeLowerThanMaximum" />;
    }

    return null;
  };

  const getNextValueWarning = useCallback((val, init) => {
    // Cast everything to string for compare
    let compareVal = val;
    let initVal = init;

    if (typeof val !== 'string') {
      compareVal = val.toString();
    }

    if (typeof init !== 'string') {
      initVal = init.toString();
    }
    // Only show warning for edit
    if (values.id && initVal !== compareVal) {
      return <FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.nextValue.changedWarning" />;
    }

    return undefined;
  }, [values]);

  return (
    <>
      <Row>
        <Col xs={6}>
          <Field
            autoFocus
            component={TextField}
            label={
              <>
                <FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.name" />
                <NameInfo />
              </>
            }
            name="name"
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
                <FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.code" />
                <CodeInfo />
              </>
            }
            name="code"
            required
            validate={requiredValidator}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={6}>
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
        <Col xs={6}>
          {/* <Field
            component={TextField}
            label={
              <>
                <FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.nextValue" />
                <NextValueInfo />
              </>
            }
            name="nextValue"
            type="number"
            validate={requiredValidator}
          /> */}
          <Field
            name="nextValue"
          >
            {({ input, meta }) => {
              return (
                <TextField
                  {...input}
                  label={
                    <>
                      <FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.nextValue" />
                      <NextValueInfo />
                    </>
                  }
                  type="number"
                  validate={requiredValidator}
                  warning={getNextValueWarning(input.value, meta.initial)}
                />
              );
            }}
          </Field>
        </Col>
      </Row>
      <Row>
        <Col xs={6}>
          <Layout className="flex">
            <Field
              component={TextField}
              label={
                <>
                  <FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.maximumNumber" />
                  <MaximumNumberInfo />
                </>
              }
              min={1}
              name="maximumNumber"
              parse={v => v}
              type="number"
              validate={validateMaximumNumber}
            />
          </Layout>
        </Col>
        <Col xs={6}>
          <Layout className="flex">
            <Field
              component={TextField}
              disabled={!values?.maximumNumber}
              label={
                <>
                  <FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.maximumNumberThreshold" />
                  <MaximumNumberThresholdInfo />
                </>
              }
              min={1}
              name="maximumNumberThreshold"
              parse={v => v}
              type="number"
              validate={validateMaximumNumberThreshold}
            />
          </Layout>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <Field
            component={TextArea}
            label={<FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.description" />}
            maxLength="255"
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
            label={
              <>
                <FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.format" />
                <FormatInfo />
              </>
            }
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
