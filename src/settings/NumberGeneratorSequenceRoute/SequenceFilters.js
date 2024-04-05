import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';

import { Badge, Col, Row, Select } from '@folio/stripes/components';

import css from './SequenceSearch.css';

// Also renders the count... for reasons...
const SequenceFilters = ({
  activeFilters,
  filterHandlers,
  totalCount
}) => {
  const intl = useIntl();

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
          // These options values are from refdata with desc 'NumberGeneratorSequence.MaximumCheck' -- setting manually to allow for translations
          // Also we need to use direct filters here since there's an "isNull" option
          { value: '', label: intl.formatMessage({ id: 'ui-service-interaction.all' }) },
          { value: 'maximumCheck.value==at_maximum', label: intl.formatMessage({ id: 'ui-service-interaction.settings.numberGeneratorSequences.maximumCheck.atMax' }) },
          { value: 'maximumCheck.value==below_threshold', label: intl.formatMessage({ id: 'ui-service-interaction.settings.numberGeneratorSequences.maximumCheck.belowThreshold' }) },
          { value: 'maximumCheck.value==over_threshold', label: intl.formatMessage({ id: 'ui-service-interaction.settings.numberGeneratorSequences.maximumCheck.overThreshold' }) },
          { value: 'maximumCheck isNull', label: intl.formatMessage({ id: 'ui-service-interaction.settings.numberGeneratorSequences.maximumCheck.noMaxSet' }) }
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
      <Col xs={4} />
      <Col xs={2}>
        <div className={css.totalCountWrapper}>
          <Badge>
            <FormattedMessage id="ui-service-interaction.nFound" values={{ total: totalCount }} />
          </Badge>
        </div>
      </Col>
    </Row>
  );
};

SequenceFilters.propTypes = {
  activeFilters: PropTypes.object,
  filterHandlers: PropTypes.object,
  totalCount: PropTypes.number.isRequired
};

export default SequenceFilters;
