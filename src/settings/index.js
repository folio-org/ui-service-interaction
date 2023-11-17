import { useCallback } from 'react';

import { FormattedMessage } from 'react-intl';
import { Settings } from '@folio/stripes/smart-components';

import NumberGeneratorConfig from './NumberGeneratorConfig';
import NumberGeneratorSequenceRoute from './NumberGeneratorSequenceRoute';

const ServintSettings = (settingProps) => {
  const renderNumberGeneratorConfig = useCallback((innerProps) => (<NumberGeneratorConfig {...innerProps} />), []);
  
  const renderNumberGeneratorSequenceRoute = useCallback((innerProps) => (
    <NumberGeneratorSequenceRoute
      baseUrl={settingProps.match?.url}
      {...innerProps}
    />
  ), [settingProps]);

  const pages = [
    {
      route: 'numberGenerators',
      label: <FormattedMessage id="ui-service-interaction.settings.numberGenerators" />,
      component: renderNumberGeneratorConfig,
    },
    {
      route: 'numberGeneratorSequences',
      label: <FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences" />,
      component: renderNumberGeneratorSequenceRoute,
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
