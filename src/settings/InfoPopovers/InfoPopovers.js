import { FormattedMessage } from 'react-intl';
import { Button, InfoPopover, Layout } from '@folio/stripes/components';

const ChecksumAlgoInfo = () => (
  <InfoPopover
    content={
      <FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.checkDigitAlgo.info" />
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
            href="https://wiki.folio.org/display/FOLIOtips/Output+templates"
            marginBottom0
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

export {
  ChecksumAlgoInfo,
  CodeInfo,
  EnabledInfo,
  FormatInfo,
  NameInfo,
  NextValueInfo,
  OutputTemplateInfo
};
