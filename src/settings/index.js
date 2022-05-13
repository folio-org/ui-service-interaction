import { FormattedMessage } from 'react-intl';
import { Settings } from '@folio/stripes/smart-components';

import NumberGeneratorConfig from './NumberGeneratorConfig';
import NumberGeneratorSequenceConfig from './NumberGeneratorSequenceConfig';

const ServintSettings = (settingProps) => {
  const pages = [
    {
      route: 'numberGenerators',
      label: <FormattedMessage id="ui-service-interaction.settings.numberGenerators" />,
      component: () => (<NumberGeneratorConfig {...settingProps} />),
    },
    {
      route: 'numberGeneratorSequences',
      label: <FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences" />,
      component: () => (<NumberGeneratorSequenceConfig {...settingProps} />),
    },
  ];

  return (
    <Settings
      pages={pages}
      paneTitle={<FormattedMessage id="ui-service-interaction.meta.title" />}
      {...settingProps}
    />
  );
};

export default ServintSettings;
