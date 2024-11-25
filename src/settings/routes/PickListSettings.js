import { useHistory } from 'react-router';

import { RefdataCategoriesSettings } from '@k-int/stripes-kint-components';

import { useStripes } from '@folio/stripes/core';


const PickListSettings = () => {
  const history = useHistory();
  const stripes = useStripes();
  const perm = stripes.hasPerm('ui-agreements.picklists.manage');
  const displayConditions = {
    create: perm,
    delete: perm,
    edit: perm
  };

  return (
    <RefdataCategoriesSettings
      displayConditions={displayConditions}
      onClose={() => history.push('/settings/erm')}
      refdataEndpoint="servint/refdata"
    />
  );
};

export default PickListSettings;
