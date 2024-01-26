import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Col, Row, Select } from '@folio/stripes/components';
import useSIRefdata from '../../hooks/useSIRefdata';

// Also renders the count... for reasons...
const SequenceFilters = ({
  activeFilters,
  filterHandlers,
}) => {
  const { 0: { values: checkValues = [] } = {} } = useSIRefdata({
    desc: 'NumberGeneratorSequence.MaximumCheck',
  });

  const renderEnabledFilter = () => {
    return (
      <Select
        dataOptions={[
          { value: '', label: <FormattedMessage id="ui-service-interaction.all" /> },
          { value: 'true', label: <FormattedMessage id="ui-service-interaction.true" /> },
          { value: 'false', label: <FormattedMessage id="ui-service-interaction.false" /> }
        ]}
        label={<FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.enabled" />}
        name="enabled"
        onChange={(e) => {
          if (e.target.value !== '') {
            filterHandlers.state({
              ...activeFilters,
              enabled: [e.target.value],
            });
          } else {
            // Remove filter if "all" is selected
            filterHandlers.state({
              ...activeFilters,
              enabled: undefined,
            });
          }
        }}
        value={activeFilters?.enabled?.[0] || ''}
      />
    );
  };

  const renderMaximumCheckFilter = () => {
    return (
      <Select
        dataOptions={[
          { value: '', label: '' },
          ...checkValues
        ]}
        label={<FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.maximumCheck" />}
        name="maximumCheck"
        onChange={(e) => {
          if (e.target.value !== '') {
            filterHandlers.state({
              ...activeFilters,
              maximumCheck: [e.target.value],
            });
          } else {
            // Remove filter if "none" is selected
            filterHandlers.state({
              ...activeFilters,
              maximumCheck: undefined,
            });
          }
        }}
        value={activeFilters?.maximumCheck?.[0] || ''}
      />
    );
  };

  return (
    <Row>
      <Col xs={3}>
        {renderEnabledFilter()}
      </Col>
      <Col xs={3}>
        {renderMaximumCheckFilter()}
      </Col>
    </Row>
  );
};

SequenceFilters.propTypes = {
  activeFilters: PropTypes.object,
  filterHandlers: PropTypes.object,
};

export default SequenceFilters;
