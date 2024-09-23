import { useIntlKeyStore } from '@k-int/stripes-kint-components';

import ServintSettings from './settings';

const App = (appProps = {}) => {
  const { actAs } = appProps;

  const addKey = useIntlKeyStore(state => state.addKey);
  addKey('ui-service-interaction');

  if (actAs === 'settings') {
    return (
      <ServintSettings {...appProps} />
    );
  }

  return null;
};

export default App;
export * from './public';
