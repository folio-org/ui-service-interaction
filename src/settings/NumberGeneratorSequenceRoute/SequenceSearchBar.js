import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';
import { Button, Col, Icon, Row } from '@folio/stripes/components';

import { SearchField } from '@k-int/stripes-kint-components';
import { SearchKeyControl, useHandleSubmitSearch } from '@folio/stripes-erm-components';
import css from './SequenceSearch.css';

const SequenceSearchBar = ({
  disableReset,
  getSearchHandlers,
  onSubmitSearch,
  resetAll,
  searchValue,
  source
}) => {
  const { handleSubmitSearch } = useHandleSubmitSearch(source);
  return (
    <form
      onSubmit={(e) => handleSubmitSearch(e, onSubmitSearch)}
    >
      <Row>
        <Col xs={10}>
          <SearchField
            data-test-sequence-search-input
            id="input-sequence-search"
            marginBottom0
            name="query"
            onChange={getSearchHandlers().query}
            onClear={getSearchHandlers().reset}
            value={searchValue.query}
          />
        </Col>
        <Col xs={2}>
          <Button
            buttonStyle="primary"
            disabled={
              !searchValue.query || searchValue.query === ''
            }
            fullWidth
            id="clickable-search-sequences"
            marginBottom0
            type="submit"
          >
            <FormattedMessage id="stripes-smart-components.search" />
          </Button>
        </Col>
      </Row>
      <Row>
        <Col xs={10}>
          {/* The options here reflect the constant defaultQIndex */}
          <SearchKeyControl
            options={[
              {
                label: (
                  <FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.name" />
                ),
                key: 'name',
              },
              {
                label: (
                  <FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.code" />
                ),
                key: 'code',
              },
              {
                label: (
                  <FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.description" />
                ),
                key: 'description',
              },
              {
                label: (
                  <FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.outputTemplate" />
                ),
                key: 'outputTemplate',
              },
            ]}
          />
        </Col>
        <Col xs={2}>
          <Button
            buttonClass={css.resetButton}
            buttonStyle="none"
            disabled={disableReset()}
            fullWidth
            id="clickable-reset-all"
            onClick={resetAll}
          >
            <Icon icon="times-circle-solid">
              <FormattedMessage id="stripes-smart-components.resetAll" />
            </Icon>
          </Button>
        </Col>
      </Row>
    </form>
  );
};

SequenceSearchBar.propTypes = {
  disableReset: PropTypes.func.isRequired,
  getSearchHandlers: PropTypes.func.isRequired,
  onSubmitSearch: PropTypes.func.isRequired,
  resetAll: PropTypes.func.isRequired,
  searchValue: PropTypes.shape({
    query: PropTypes.string
  }).isRequired,
  source: PropTypes.object.isRequired
};

export default SequenceSearchBar;
