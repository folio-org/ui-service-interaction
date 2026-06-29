import { FormattedMessage, useIntl } from 'react-intl';
import { Button, InfoPopover, Layout } from '@folio/stripes/components';

import css from './Styles.css';

// Literal output-template tokens shown in the info table — not string interpolation.
/* eslint-disable no-template-curly-in-string */
const TOKENS = [
  { token: '${current_year}', descriptionId: 'ui-service-interaction.settings.numberGeneratorSequences.outputTemplate.info.currentYear' },
  { token: '${generated_number}', descriptionId: 'ui-service-interaction.settings.numberGeneratorSequences.outputTemplate.info.generatedNumber' },
  { token: '${checksum}', descriptionId: 'ui-service-interaction.settings.numberGeneratorSequences.outputTemplate.info.checksum' },
];
/* eslint-enable no-template-curly-in-string */

const ChecksumAlgoInfo = () => (
  <InfoPopover
    content={
      <Layout className="flex flex-direction-column centerContent">
        <Layout>
          <FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.checkDigitAlgo.info" />
        </Layout>
        <Layout className="marginTop1">
          <Button
            allowAnchorClick
            buttonStyle="primary"
            href="https://docs.folio.org/docs/settings/settings_service_interaction/settings_service_interaction/#method"
            marginBottom0
            rel="noreferrer"
            target="blank"
          >
            <FormattedMessage id="ui-service-interaction.learnMore" />
          </Button>
        </Layout>
      </Layout>
    }
  />
);

const CodeInfo = () => (
  <InfoPopover
    content={
      <FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.code.info" />
    }
  />
);

const NameInfo = () => (
  <InfoPopover
    content={
      <FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.name.info" />
    }
  />
);

const EnabledInfo = () => (
  <InfoPopover
    content={
      <FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.enabled.info" />
    }
  />
);

const NextValueInfo = () => (
  <InfoPopover
    content={
      <FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.nextValue.info" />
    }
  />
);

const OutputTemplateInfo = () => {
  const intl = useIntl();

  return (
    <InfoPopover
      className={css.customPopoverWidth}
      content={
        <Layout className="flex flex-direction-column centerContent">
          <table className={css.tokenTable}>
            <thead>
              <tr>
                <th className={css.tokenCol} scope="col">{intl.formatMessage({ id: 'ui-service-interaction.settings.numberGeneratorSequences.outputTemplate.info.token' })}</th>
                <th scope="col">{intl.formatMessage({ id: 'ui-service-interaction.settings.numberGeneratorSequences.outputTemplate.info.description' })}</th>
              </tr>
            </thead>
            <tbody>
              {TOKENS.map(({ token, descriptionId }) => (
                <tr key={token}>
                  <td className={css.tokenCol}>{token}</td>
                  <td><FormattedMessage id={descriptionId} /></td>
                </tr>
              ))}
            </tbody>
          </table>
          <Layout className="marginTop1">
            <FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.outputTemplate.info" />
          </Layout>
          <Layout className="marginTop1">
            <Button
              allowAnchorClick
              buttonStyle="primary"
              href="https://docs.folio.org/docs/settings/settings_service_interaction/settings_service_interaction/#output-settings"
              marginBottom0
              rel="noreferrer"
              target="blank"
            >
              <FormattedMessage id="ui-service-interaction.learnMore" />
            </Button>
          </Layout>
        </Layout>
      }
    />
  );
};

const PreChecksumTemplateInfo = () => (
  <InfoPopover
    content={
      <Layout className="flex flex-direction-column centerContent">
        <Layout>
          <FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.preChecksumTemplate.info" />
        </Layout>
        <Layout className="marginTop1">
          <Button
            allowAnchorClick
            buttonStyle="primary"
            href="https://docs.folio.org/docs/settings/settings_service_interaction/settings_service_interaction/#input-template"
            marginBottom0
            rel="noreferrer"
            target="blank"
          >
            <FormattedMessage id="ui-service-interaction.learnMore" />
          </Button>
        </Layout>
      </Layout>
    }
  />
);

const FormatInfo = () => (
  <InfoPopover
    className={css.customPopoverWidth}
    content={
      <div>
        <FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.format.info" />
        <ul>
          <li><FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.format.info.item1" /></li>
          <li><FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.format.info.item2" /></li>
          <li><FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.format.info.item3" /></li>
        </ul>
      </div>
    }
  />
);

const MaximumNumberInfo = () => (
  <InfoPopover
    content={
      <FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.maximumNumber.info" />
    }
  />
);

const MaximumNumberThresholdInfo = () => (
  <InfoPopover
    content={
      <FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.maximumNumberThreshold.info" />
    }
  />
);

export {
  ChecksumAlgoInfo,
  CodeInfo,
  EnabledInfo,
  FormatInfo,
  MaximumNumberInfo,
  MaximumNumberThresholdInfo,
  NameInfo,
  NextValueInfo,
  OutputTemplateInfo,
  PreChecksumTemplateInfo,
};
