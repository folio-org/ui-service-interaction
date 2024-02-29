import { forwardRef, useCallback, useEffect, useMemo, useState } from 'react';

import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import isEqual from 'lodash/isEqual';

import {
  QueryTypedown,
  generateKiwtQueryParams,
  highlightString
} from '@k-int/stripes-kint-components';
import { Button, Checkbox, Layout, Modal, ModalFooter } from '@folio/stripes/components';

import { InfoBox } from '@folio/stripes-erm-components';

import { AT_MAXIMUM, BELOW_THRESHOLD, OVER_THRESHOLD } from '../../constants';
import { useNumberGeneratorSequences } from '../../hooks';
import NumberGeneratorButton from '../NumberGeneratorButton';

import css from '../../Styles.css';

const SEQUENCE_TYPEDOWN_ID = 'sequence_typedown';

const NumberGeneratorModal = forwardRef(({
  callback,
  displayError = true,
  displayWarning = true,
  generateButtonLabel,
  // This is the numberGenerator code, and is optional.
  // Omitting will result in all sequences appearing in select
  generator,
  generatorButtonProps,
  id,
  renderTop,
  renderBottom,
  ...modalProps
}, ref) => {
  const [includeSequencesAtMaximum, setIncludeSequencesAtMaximum] = useState(false);

  // Separate this out, so we _know_ initial fetch will have same shape as queryTypedown does
  const kiwtQueryParamOptions = useMemo(() => ({
    ...(generator && {
      filters: [
        {
          path: 'owner.code',
          value: generator
        },
        (!includeSequencesAtMaximum && {
          // A OR B needs to be NOT(NOT(A) AND NOT(B)) instead...
          // For whatever reason groupValues is not encoding && and || right now, which causes issues
          value: '!(maximumCheck isNotNull&&maximumCheck.value==at_maximum)'
        })
      ]
    }),
    pageSize: 10,
    searchKey: 'name,code',
    stats: false,
    sort: [{ path: 'owner.code' }, { path: 'name' }, { path: 'code' }],
  }), [generator, includeSequencesAtMaximum]);

  // We need extra call to ensure data integrity _after_selection.
  // This will _only_ be used for updating after generation and initial population
  const standaloneSequenceCallParams = generateKiwtQueryParams(kiwtQueryParamOptions, {});
  const { data: standaloneSequences = [], isFetching: isStandaloneSequencesFetching } = useNumberGeneratorSequences({
    queryParams: standaloneSequenceCallParams
  });

  // Manage the object states separately to the "select" state.
  const [selectedSequence, setSelectedSequence] = useState();

  useEffect(() => {
    if (!isStandaloneSequencesFetching) {
      if (
        // We've fetched all sequences, and there is none currently selected
        (standaloneSequences.length > 0 && !selectedSequence) ||
        // Selected sequence is no longer in standalone sequences -- likely due to passing maximum value
        (selectedSequence && (standaloneSequences.filter(ss => ss.id === selectedSequence.id)?.length ?? 0) === 0)
      ) {
        setSelectedSequence(standaloneSequences[0]);
      } else {
        const selectedSequenceInData = standaloneSequences?.filter(sq => sq.id === selectedSequence?.id)?.[0];

        if (!!selectedSequenceInData && !isEqual(selectedSequence, selectedSequenceInData)) {
          // Refetched SS differs, setSS
          setSelectedSequence(selectedSequenceInData);
        }
      }
    }
  }, [isStandaloneSequencesFetching, selectedSequence, standaloneSequences]);

  const overThreshold = useMemo(() => selectedSequence?.maximumCheck?.value === OVER_THRESHOLD, [selectedSequence?.maximumCheck?.value]);
  const atMaximum = useMemo(() => selectedSequence?.maximumCheck?.value === AT_MAXIMUM, [selectedSequence?.maximumCheck?.value]);


  const renderTypedownFooter = () => {
    return (
      <Layout className="display-flex flex-align-items-start">
        <Layout style={{ 'padding-right': '30%' }}>
          <Layout style={{ 'padding-right': '10px', display: 'inline' }}>
            <Checkbox
              checked={includeSequencesAtMaximum}
              id="includeAtMaxSequences_label"
              onChange={(e) => {
                e.stopPropagation();
                setIncludeSequencesAtMaximum(e?.target?.checked);
              }}
            />
          </Layout>
          <FormattedMessage
            for="includeAtMaxSequences_label"
            id="ui-service-interaction.numberGenerator.modal.includeAtMaxSequences"
          />
        </Layout>
      </Layout>
    );
  };

  const renderWarningText = () => {
    if (displayWarning && overThreshold) {
      return (
        <div className={css.warningText}>
          <FormattedMessage id="ui-service-interaction.numberGenerator.warning.sequenceOverThresholdWarning" values={{ name: selectedSequence.name, maxVal: selectedSequence.maximumNumber }} />
        </div>
      );
    }

    return undefined;
  };

  const renderErrorText = () => {
    if (displayError && atMaximum) {
      return (
        <div className={css.errorText}>
          <FormattedMessage id="ui-service-interaction.numberGenerator.error.sequenceOverMaximumError" values={{ name: selectedSequence.name, maxVal: selectedSequence.maximumNumber }} />
        </div>
      );
    }

    return undefined;
  };

  const pathMutator = useCallback((input, path) => {
    const queryParams = generateKiwtQueryParams(
      kiwtQueryParamOptions,
      {
        query: input,
      }
    );

    return `${path}?${queryParams.join('&')}`;
  }, [kiwtQueryParamOptions]);

  const renderListItem = (sequence, input) => {
    return (
      <Layout className="display-flex">
        <Layout className={`display-flex ${css.boldItem}`}>
          {highlightString(
            input,
            sequence.name,
            true,
            false
          )}
        </Layout>
        <Layout className={`display-flex ${css.boldItem} ${css.itemMargin}`}>
          <FormattedMessage id="ui-service-interaction.separator" />
        </Layout>
        <Layout className={`display-flex ${css.boldItem} ${css.greyItem} ${css.itemMargin}`}>
          {highlightString(
            input,
            sequence.code,
            true,
            false
          )}
        </Layout>
        <Layout className={`display-flex ${css.greyItem} ${css.itemMargin}`}>
          <FormattedMessage id="ui-service-interaction.separator" />
        </Layout>
        <Layout className={`display-flex ${css.greyItem} ${css.itemMargin}`}>
          <FormattedMessage id="ui-service-interaction.numberGenerator.modal.nextValue" values={{ value: sequence.nextValue }} />
        </Layout>
        {sequence.maximumCheck?.value && sequence.maximumCheck.value !== BELOW_THRESHOLD &&
          <>
            <Layout className={`display-flex ${css.greyItem} ${css.itemMargin}`}>
              <FormattedMessage id="ui-service-interaction.separator" />
            </Layout>
            <Layout className={`display-flex ${css.greyItem} ${css.itemMargin}`}>
              <FormattedMessage id="ui-service-interaction.numberGenerator.modal.maximumCheck" />
            </Layout>
            {sequence.maximumCheck.value === OVER_THRESHOLD &&
              <Layout className={`display-flex ${css.itemMargin}`}>
                <InfoBox type="warn">
                  <FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.maximumCheck.overThreshold" />
                </InfoBox>
              </Layout>
            }
            {sequence.maximumCheck.value === AT_MAXIMUM &&
              <Layout className={`display-flex ${css.itemMargin}`}>
                <InfoBox type="error">
                  <FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.maximumCheck.atMax" />
                </InfoBox>
              </Layout>
            }
          </>
        }
      </Layout>
    );
  };

  const renderEndOFList = () => {
    return (
      <Layout className={css.endOfTypedownList}>
        <FormattedMessage id="ui-service-interaction.noResultsFound" />
      </Layout>
    );
  };

  return (
    <Modal
      ref={ref}
      enforceFocus={false} // Necessary to prevent it fighting focus handler in typedown
      footer={
        <ModalFooter>
          <NumberGeneratorButton
            buttonLabel={generateButtonLabel}
            callback={(generated) => {
              callback(generated);
            }}
            displayError={false} // We are dealing with error/warning manually in the modal
            displayWarning={false}
            generator={selectedSequence?.owner?.code ?? ''}
            id={id}
            marginBottom0
            sequence={selectedSequence?.code ?? ''}
            {...generatorButtonProps}
          />
          <Button
            marginBottom0
            onClick={modalProps.onClose}
          >
            <FormattedMessage id="ui-service-interaction.cancel" />
          </Button>
        </ModalFooter>
      }
      id={`number-generator-modal-${id}`}
      label={<FormattedMessage id="ui-service-interaction.numberGenerator.selectGenerator" />}
      {...modalProps}
    >
      {renderTop ? renderTop() : null}
      <QueryTypedown
        endOfList={renderEndOFList()}
        id={SEQUENCE_TYPEDOWN_ID}
        // To use this as a controlled component is currently a little fiddly, spoof an input opbject
        input={{
          name: SEQUENCE_TYPEDOWN_ID,
          onChange: (seq) => setSelectedSequence(seq),
          value: selectedSequence
        }}
        path="servint/numberGeneratorSequences"
        pathMutator={pathMutator}
        renderFooter={renderTypedownFooter}
        renderListItem={renderListItem}
      />
      {renderBottom ? renderBottom() : null}
    </Modal>
  );
});

NumberGeneratorModal.propTypes = {
  callback: PropTypes.func.isRequired,
  displayError: PropTypes.bool,
  displayWarning: PropTypes.bool,
  generateButtonLabel: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node
  ]),
  generator: PropTypes.string,
  generatorButtonProps: PropTypes.object,
  id: PropTypes.string.isRequired,
  renderBottom: PropTypes.func,
  renderTop: PropTypes.func,
};

export default NumberGeneratorModal;
