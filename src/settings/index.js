import { useCallback } from 'react';

import { FormattedMessage } from 'react-intl';
import { Settings } from '@folio/stripes/smart-components';

import NumberGeneratorConfig from './NumberGeneratorConfig';
import NumberGeneratorSequenceConfig from './NumberGeneratorSequenceConfig';

const ServintSettings = (settingProps) => {
  const renderNumberGeneratorConfig = useCallback(() => (<NumberGeneratorConfig {...settingProps} />), [settingProps]);
  const renderNumberGeneratorSequenceConfig = useCallback(() => (<NumberGeneratorSequenceConfig {...settingProps} />), [settingProps]);

  const pages = [
    {
      route: 'numberGenerators',
      label: <FormattedMessage id="ui-service-interaction.settings.numberGenerators" />,
      component: renderNumberGeneratorConfig,
    },
    {
      route: 'numberGeneratorSequences',
      label: <FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences" />,
      component: renderNumberGeneratorSequenceConfig,
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
