import { FormattedMessage } from 'react-intl';
import { Settings } from '@folio/stripes/smart-components';

const ServintSettings = (props) => {
  const pages = [
    {
      route: 'numberGenerators',
      label: <FormattedMessage id="ui-service-interaction.settings.numberGenerators" />,
      component: () => (<div> Hello world </div>),
    },
  ];

  return (
    <Settings
      pages={pages}
      paneTitle={<FormattedMessage id="ui-service-interaction.meta.title" />}
      {...props}
    />
  );
};

export default ServintSettings;
