import { FormattedMessage } from 'react-intl';
import { Button, InfoPopover, Layout } from '@folio/stripes/components';

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
            href="https://docs.folio.org/docs/settings/settings_service_interaction/settings_service_interaction"
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

const OutputTemplateInfo = () => (
  <InfoPopover
    content={
      <Layout className="flex flex-direction-column centerContent">
        <Layout>
          <FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.outputTemplate.info" />
        </Layout>
        <Layout className="marginTop1">
          <Button
            allowAnchorClick
            buttonStyle="primary"
            href="https://docs.folio.org/docs/settings/settings_service_interaction/settings_service_interaction"
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
            href="https://docs.folio.org/docs/settings/settings_service_interaction/settings_service_interaction"
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
    content={
      <FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.format.info" />
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
