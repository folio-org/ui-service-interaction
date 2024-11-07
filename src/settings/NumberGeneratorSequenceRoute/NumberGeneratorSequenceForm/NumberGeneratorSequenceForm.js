import { useCallback } from 'react';
import { Field, useForm, useFormState } from 'react-final-form';
import { FormattedMessage } from 'react-intl';

import { NumberField, composeValidators, required as requiredValidator } from '@k-int/stripes-kint-components';

import {
  Checkbox,
  Col,
  Headline,
  Layout,
  Row,
  Select,
  TextArea,
  TextField
} from '@folio/stripes/components';

import { preventMinusKey, preventPasteNegative } from '@folio/stripes-erm-components';

import { BASE_TEMPLATE } from '../../../public';
import { useChecksumAlgorithms, useSIRefdata } from '../../../hooks';

import {
  ChecksumAlgoInfo,
  CodeInfo,
  EnabledInfo,
  FormatInfo,
  MaximumNumberInfo,
  MaximumNumberThresholdInfo,
  NameInfo,
  NextValueInfo,
  OutputTemplateInfo,
  PreChecksumTemplateInfo
} from '../../InfoPopovers';

import css from '../Styles.css';

const NumberGeneratorSequenceForm = () => {
  const { values } = useFormState();
  const { change } = useForm();

  const { 0: { values: checksums = [] } = {} } = useSIRefdata({
    desc: 'NumberGeneratorSequence.CheckDigitAlgo',
  });

  const { checkDigitAlgoOptions, noneChecksumId, validateChecksum } = useChecksumAlgorithms();

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

  const validateFormatField = (val, allVal) => {
    if (allVal.maximumNumber) {
      return requiredValidator(val, allVal);
    }

    return null;
  };

  const getNextValueWarning = useCallback((val, init) => {
    // Cast everything to string for compare
    let compareVal = val;
    let initVal = init;

    if (val && typeof val !== 'string') {
      compareVal = val.toString();
    }

    if (init && typeof init !== 'string') {
      initVal = init.toString();
    }
    // Only show warning for edit
    if (values.id && initVal !== compareVal) {
      return <FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.nextValue.changedWarning" />;
    }

    return null;
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
          <Layout className={css.enabled}>
            <Layout className="flex margin-end-gutter">
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
            maxLength="255"
            name="description"
            parse={v => v}
          />
        </Col>
      </Row>
      <Headline
        margin="xx-small"
        size="large"
      >
        <FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.section.sequenceSettings" />
      </Headline>
      <Row>
        <Col xs={6}>
          <Layout className="flex">
            <Field
              component={NumberField}
              label={
                <>
                  <FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.maximumNumber" />
                  <MaximumNumberInfo />
                </>
              }
              min={1}
              name="maximumNumber"
              onKeyDown={preventMinusKey}
              onPaste={preventPasteNegative}
              parse={v => v}
              validate={validateMaximumNumber}
            />
          </Layout>
        </Col>
        <Col xs={6}>
          <Layout className="flex">
            <Field
              component={NumberField}
              disabled={!values?.maximumNumber}
              label={
                <>
                  <FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.maximumNumberThreshold" />
                  <MaximumNumberThresholdInfo />
                </>
              }
              min={1}
              name="maximumNumberThreshold"
              onKeyDown={preventMinusKey}
              onPaste={preventPasteNegative}
              parse={v => v}
              validate={validateMaximumNumberThreshold}
            />
          </Layout>
        </Col>
      </Row>
      <Row>
        <Col xs={6}>
          <Field
            name="nextValue"
            validate={requiredValidator}
          >
            {({ input, meta }) => {
              return (
                <NumberField
                  input={input}
                  label={
                    <>
                      <FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.nextValue" />
                      <NextValueInfo />
                    </>
                  }
                  min={1}
                  onKeyDown={preventMinusKey}
                  onPaste={preventPasteNegative}
                  warning={getNextValueWarning(input.value, meta.initial)}
                />
              );
            }}
          </Field>
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
            required={!!values.maximumNumber}
            validate={validateFormatField}
          />
        </Col>
      </Row>
      <Headline
        margin="xx-small"
        size="large"
      >
        <FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.section.checksumSettings" />
      </Headline>
      <Row>
        <Col xs={6}>
          <Field
            name="checkDigitAlgo.id" // checkDigitAlgo should deal with the id
            parse={v => v}
            validate={composeValidators(validateChecksum, requiredValidator)}
          >
            {({ input, meta }) => {
              return (
                <Select
                  dataOptions={checkDigitAlgoOptions}
                  fullWidth
                  input={input}
                  label={
                    <>
                      <FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.checkDigitAlgo" />
                      <ChecksumAlgoInfo />
                    </>
                  }
                  meta={meta}
                  onChange={e => {
                    if (
                      input.value === noneChecksumId &&
                      e.target.value !== noneChecksumId
                    ) {
                      change('preChecksumTemplate', BASE_TEMPLATE);
                    } else if (
                      input.value !== noneChecksumId &&
                      e.target.value === noneChecksumId
                    ) {
                      change('preChecksumTemplate', undefined);
                    }
                    // Do the thing we would do normally
                    input.onChange(e);
                  }}
                  required
                />
              );
            }}
          </Field>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <Field
            component={TextArea}
            disabled={values.checkDigitAlgo?.id === noneChecksumId}
            label={
              <>
                <FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.preChecksumTemplate" />
                <PreChecksumTemplateInfo />
              </>
            }
            name="preChecksumTemplate"
            parse={v => v}
          />
        </Col>
      </Row>
      <Headline
        margin="xx-small"
        size="large"
      >
        <FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.section.outputSettings" />
      </Headline>
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
            required
            validate={requiredValidator}
          />
        </Col>
      </Row>
    </>
  );
};

export default NumberGeneratorSequenceForm;
