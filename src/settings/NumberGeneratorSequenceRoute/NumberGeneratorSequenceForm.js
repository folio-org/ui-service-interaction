import { useCallback } from 'react';
import { Field, useFormState } from 'react-final-form';
import { FormattedMessage } from 'react-intl';

import { NumberField, composeValidators, required as requiredValidator } from '@k-int/stripes-kint-components';

import {
  Checkbox,
  Col,
  Layout,
  Row,
  Select,
  TextArea,
  TextField
} from '@folio/stripes/components';

import { preventMinusKey, preventPasteNegative } from '@folio/stripes-erm-components';

import useSIRefdata from '../../hooks/useSIRefdata';
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
} from '../InfoPopovers';

import css from './SequenceSearch.css';

const NumberGeneratorSequenceForm = () => {
  const { values } = useFormState();

  const { 0: { values: checksums = [] } = {} } = useSIRefdata({
    desc: 'NumberGeneratorSequence.CheckDigitAlgo',
  });

  // I'd like a smarter way to do this in future, potentially "custom" checksums set up by the users.
  const currentlySupportedChecksums = [
    'none',
    'ean13',
    'isbn10checkdigit',
    'luhncheckdigit',
    '1793ltrmod10',
    '12ltrmod10',
    'issncheckdigit'
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
      </Row>
      <Row>
        <Col xs={12}>
          <Field
            component={TextArea}
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
    </>
  );
};

export default NumberGeneratorSequenceForm;
