import { translationsProperties as coreTranslations } from '@folio/stripes-erm-testing';

import translations from '../../translations/ui-service-interaction/en';

const translationsProperties = [
  {
    prefix: 'ui-service-interaction',
    translations,
  },
  ...coreTranslations
];

export default translationsProperties;
