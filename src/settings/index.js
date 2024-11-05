import { useCallback } from 'react';

import { FormattedMessage } from 'react-intl';
import { Settings } from '@folio/stripes/smart-components';

import NumberGeneratorConfig from './NumberGeneratorConfig';
import NumberGeneratorSequenceRoute from './NumberGeneratorSequenceRoute';

const ServintSettings = (settingProps) => {
  const renderNumberGeneratorConfig = useCallback((innerProps) => (<NumberGeneratorConfig {...innerProps} />), []);
  const numberGeneratorViewPerm = 'ui-service-interaction.numberGenerator.view';
  const renderNumberGeneratorSequenceRoute = useCallback((innerProps) => (
    <NumberGeneratorSequenceRoute
      baseUrl={settingProps.match?.url}
      {...innerProps}
    />
  ), [settingProps]);

  const sections = [
    {
      label: <FormattedMessage id="ui-service-interaction.settings.numberGenerators" />,
      pages: [
        {
          route: 'numberGenerators',
          label: <FormattedMessage id="ui-service-interaction.settings.numberGenerators" />,
          component: renderNumberGeneratorConfig,
          perm: numberGeneratorViewPerm
        },
        {
          route: 'numberGeneratorSequences',
          label: <FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences" />,
          component: renderNumberGeneratorSequenceRoute,
          perm: numberGeneratorViewPerm
        },
      ]
    }
  ];

  return (
    <Settings
      navPaneWidth="20%"
      paneTitle={<FormattedMessage id="ui-service-interaction.meta.title" />}
      sections={sections}
      {...settingProps}
    />
  );
};

export default ServintSettings;
