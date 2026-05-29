import { useCallback, useEffect, useMemo, useState } from 'react';

import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import isEqual from 'lodash/isEqual';
import noop from 'lodash/noop';

import {
  Typedown,
  highlightString
} from '@k-int/stripes-kint-components';

import { Checkbox, Layout } from '@folio/stripes/components';
import { InfoBox, useParallelBatchFetch } from '@folio/stripes-erm-components';

import { AT_MAXIMUM, BELOW_THRESHOLD, NUMBER_GENERATOR_SEQUENCES_ENDPOINT, OVER_THRESHOLD } from '../../constants';
import css from '../../Styles.css';

export const SEQUENCE_TYPEDOWN_ID = 'sequence_typedown';
export const SEQUENCE_TYPEDOWN_ID_UNIQUE = (id) => `${SEQUENCE_TYPEDOWN_ID}_${id}`;

// CSS Components
const cssLayoutItem = `display-flex ${css.itemMargin}`;
const cssLayoutGreyItem = (isSelected) => { return isSelected ? cssLayoutItem : `${cssLayoutItem} ${css.greyItem}`; };
const cssLayoutBoldItem = `${cssLayoutItem} ${css.boldItem}`;

const Separator = ({ bold = false, isSelected = false }) => (
  <Layout
    className={bold ? cssLayoutBoldItem : cssLayoutGreyItem(isSelected)}
  >
    <FormattedMessage id="ui-service-interaction.separator" />
  </Layout>
);

Separator.propTypes = {
  bold: PropTypes.bool,
  isSelected: PropTypes.bool
};

const NumberGeneratorSelector = ({
  displayError = true,
  displayWarning = false,
  // This is the numberGenerator code, and is optional.
  // Omitting will result in all sequences appearing in select
  generator,
  id, // Can be null, necessary when there are multiple NumberGeneratorSelectors on screen
  // The actual selection is internal (can't be controlled component rn) but we can perform an action on sequenceSelected
  onSequenceChange = noop,
  // Turn this off to render selector with no sequence selected automatically
  selectFirstSequenceOnMount = true,
  ...queryTypedownProps
}) => {
  const uniqueId = id ? SEQUENCE_TYPEDOWN_ID_UNIQUE(id) : SEQUENCE_TYPEDOWN_ID;

  const [includeSequencesAtMaximum, setIncludeSequencesAtMaximum] = useState(false);
  const [exactCodeMatch, setExactCodeMatch] = useState(false);

  // Manage the object states separately to the "select" state.
  const [selectedSequence, setSelectedSequence] = useState();

  // Track "first mount" selection of first sequence
  const [selectFirstSequence, setSelectFirstSequence] = useState(selectFirstSequenceOnMount);

  const kiwtQueryParamOptions = useMemo(() => ({
    filters: [
      {
        path: 'enabled',
        value: true
      },
      (generator && {
        path: 'owner.code',
        value: generator
      }),
      (!includeSequencesAtMaximum && {
        // A OR B needs to be NOT(NOT(A) AND NOT(B)) instead...
        // For whatever reason groupValues is not encoding && and || right now, which causes issues
        value: '!(maximumCheck isNotNull&&maximumCheck.value==at_maximum)'
      }),
    ],
    sort: [{ path: 'owner.code' }, { path: 'name' }, { path: 'code' }],
  }), [generator, includeSequencesAtMaximum]);

  const [query, setQuery] = useState('');

  const { items: standaloneSequences, isLoading: isStandaloneSequencesFetching } = useParallelBatchFetch({
    batchParams: kiwtQueryParamOptions,
    endpoint: NUMBER_GENERATOR_SEQUENCES_ENDPOINT,
    generateQueryKey: ({ batchParams, offset }) => [NUMBER_GENERATOR_SEQUENCES_ENDPOINT, batchParams, offset, 'ui-service-interaction', 'useNumberGeneratorSequences']
  });

  const filteredSequences = useMemo(() => {
    if (!query) return standaloneSequences;
    if (exactCodeMatch) {
      return standaloneSequences.filter(s => s.code === query);
    }
    const regex = new RegExp(query.toLowerCase());
    return standaloneSequences.filter(s => s.name?.toLowerCase().match(regex) ||
      s.code?.toLowerCase().match(regex));
  }, [exactCodeMatch, query, standaloneSequences]);

  const changeSelectedSequence = useCallback((seq) => {
    setSelectedSequence(seq);
    onSequenceChange(seq);
  }, [onSequenceChange]);

  useEffect(() => {
    if (!isStandaloneSequencesFetching) {
      if (
        // We've fetched all sequences, and there is none currently selected
        (
          (standaloneSequences.length > 0 && !selectedSequence) ||
          // Selected sequence is no longer in standalone sequences -- likely due to passing maximum value
          (selectedSequence && (standaloneSequences.filter(ss => ss.id === selectedSequence.id)?.length ?? 0) === 0)
        ) &&
        selectFirstSequence
      ) {
        changeSelectedSequence(standaloneSequences[0]);
      } else {
        const selectedSequenceInData = standaloneSequences?.filter(sq => sq.id === selectedSequence?.id)?.[0];

        if (!!selectedSequenceInData && !isEqual(selectedSequence, selectedSequenceInData)) {
          // Refetched SS differs, setSS
          changeSelectedSequence(selectedSequenceInData);
        }
      }
      setSelectFirstSequence(false);
    }

    // On unmount reset selection lock
    return () => setSelectFirstSequence(selectFirstSequenceOnMount);
  }, [
    changeSelectedSequence,
    isStandaloneSequencesFetching,
    selectFirstSequence,
    selectFirstSequenceOnMount,
    selectedSequence,
    standaloneSequences
  ]);

  const overThreshold = useMemo(() => selectedSequence?.maximumCheck?.value === OVER_THRESHOLD, [selectedSequence?.maximumCheck?.value]);
  const atMaximum = useMemo(() => selectedSequence?.maximumCheck?.value === AT_MAXIMUM, [selectedSequence?.maximumCheck?.value]);


  const renderTypedownFooter = () => {
    return (
      <Layout className="display-flex flex-align-items-start">
        <Layout style={{ display: 'flex', width: '100%' }}>
          <Layout style={{ display: 'flex' }}>
            <Checkbox
              checked={includeSequencesAtMaximum}
              id="includeAtMaxSequences_label"
              onChange={(e) => {
                e.stopPropagation();
                setIncludeSequencesAtMaximum(e?.target?.checked);
              }}
            />
          </Layout>
          <Layout style={{ display: 'flex', paddingLeft: '10px' }}>
            <FormattedMessage
              for="includeAtMaxSequences_label"
              id="ui-service-interaction.numberGenerator.modal.includeAtMaxSequences"
            />
          </Layout>
        </Layout>
        <Layout style={{ display: 'flex', width: '100%' }}>
          <Layout style={{ display: 'flex' }}>
            <Checkbox
              checked={exactCodeMatch}
              id="exact_match_label"
              onChange={(e) => {
                e.stopPropagation();
                setExactCodeMatch(e?.target?.checked);
              }}
            />
          </Layout>
          <Layout style={{ display: 'flex', paddingLeft: '10px' }}>
            <FormattedMessage
              for="exact_match_label"
              id="ui-service-interaction.numberGenerator.modal.exactCodeMatch"
            />
          </Layout>
        </Layout>
      </Layout>
    );
  };

  const renderWarningText = () => {
    if (selectedSequence && displayWarning && overThreshold) {
      return (
        <div className={css.warningText}>
          <FormattedMessage id="ui-service-interaction.numberGenerator.warning.sequenceOverThresholdWarning" values={{ name: selectedSequence.name, maxVal: selectedSequence.maximumNumber }} />
        </div>
      );
    }

    return undefined;
  };

  const renderErrorText = () => {
    if (selectedSequence && displayError && atMaximum) {
      return (
        <div className={css.errorText}>
          <FormattedMessage id="ui-service-interaction.numberGenerator.error.sequenceOverMaximumError" values={{ name: selectedSequence.name, maxVal: selectedSequence.maximumNumber }} />
        </div>
      );
    }

    return undefined;
  };

  const renderListItem = useCallback((sequence, input, _e, isSelected) => {
    const keyBase = `${uniqueId}-${sequence.id}`;

    const layouts = [
      <Layout
        key={`${keyBase}-nextValue-layout`}
        className={cssLayoutGreyItem(isSelected)}
      >
        <FormattedMessage id="ui-service-interaction.numberGenerator.modal.nextValue" values={{ value: sequence.nextValue }} />
      </Layout>
    ];

    if (sequence.maximumCheck?.value && sequence.maximumCheck.value !== BELOW_THRESHOLD) {
      layouts.push(
        <Separator
          key={`${keyBase}-separator-maxCheck-layout`}
          isSelected={isSelected}
        />,
        <Layout
          key={`${keyBase}-maxCheck-layout`}
          className={cssLayoutGreyItem(isSelected)}
        >
          <FormattedMessage id="ui-service-interaction.numberGenerator.modal.maximumCheck" />
        </Layout>
      );
    }

    if (sequence.maximumCheck?.value === OVER_THRESHOLD) {
      layouts.push(
        <Layout
          key={`${keyBase}-maxCheck-infoBox-layout`}
          className={cssLayoutItem}
        >
          <InfoBox type="warn">
            <FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.maximumCheck.overThreshold" />
          </InfoBox>
        </Layout>
      );
    }

    if (sequence.maximumCheck?.value === AT_MAXIMUM) {
      layouts.push(
        <Layout
          key={`${keyBase}-maxCheck-infoBox-layout`}
          className={cssLayoutItem}
        >
          <InfoBox type="error">
            <FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.maximumCheck.atMax" />
          </InfoBox>
        </Layout>
      );
    }

    if (!exactCodeMatch) {
      layouts.unshift(
        <Layout
          key={`${keyBase}-name-layout`}
          className={cssLayoutBoldItem}
        >
          {highlightString(
            input,
            sequence.name,
            true,
            false
          )}
        </Layout>,
        <Separator
          key={`${keyBase}-separator-code-layout`}
          bold
          isSelected={isSelected}
        />,
        <Layout
          key={`${keyBase}-code-layout`}
          className={cssLayoutGreyItem(isSelected)}
        >
          {highlightString(
            input,
            sequence.code,
            true,
            false
          )}
        </Layout>,
        <Separator
          key={`${keyBase}-separator-after-code-layout`}
          isSelected={isSelected}
        />,
      );
    } else {
      layouts.unshift(
        <Layout
          key={`${keyBase}-name-layout`}
          className={cssLayoutBoldItem}
        >
          {sequence.name}
        </Layout>,
        <Separator
          key={`${keyBase}-separator-code-layout`}
          isSelected={isSelected}
        />,
        <Layout
          key={`${keyBase}-code-layout`}
          className={cssLayoutGreyItem(isSelected)}
        >
          {input === sequence.code ? <mark>{sequence.code}</mark> : sequence.code}
        </Layout>,
        <Separator
          key={`${keyBase}-separator-after-code-layout`}
          isSelected={isSelected}
        />,
      );
    }

    if (!generator) {
      layouts.unshift(
        <Layout
          key={`${keyBase}-owner-layout`}
          className={cssLayoutBoldItem}
        >
          {sequence.owner.name}
        </Layout>,
        <Separator
          key={`${keyBase}-separator-after-owner-layout`}
          bold
          isSelected={isSelected}
        />,
      );
    }

    return (
      <Layout className="display-flex">
        {layouts}
      </Layout>
    );
  }, [exactCodeMatch, generator, uniqueId]);

  const renderEndOFList = () => {
    return (
      <Layout className={css.endOfTypedownList}>
        <FormattedMessage id="ui-service-interaction.noResultsFound" />
      </Layout>
    );
  };

  return (
    <>
      <Typedown
        dataOptions={filteredSequences}
        displayClearItem={false}
        endOfList={renderEndOFList()}
        id={uniqueId}
        input={{
          name: uniqueId,
          onChange: (seq) => changeSelectedSequence(seq),
          value: selectedSequence
        }}
        // To use this as a controlled component is currently a little fiddly, spoof an input object
        onType={(e) => setQuery(e.target.value)}
        renderFooter={renderTypedownFooter}
        renderListItem={renderListItem}
        {...queryTypedownProps}
      />
      {renderWarningText()}
      {renderErrorText()}
    </>
  );
};

NumberGeneratorSelector.propTypes = {
  displayError: PropTypes.bool,
  displayWarning: PropTypes.bool,
  generator: PropTypes.string,
  id: PropTypes.string,
  onSequenceChange: PropTypes.func,
  selectFirstSequenceOnMount: PropTypes.bool
};

export default NumberGeneratorSelector;
