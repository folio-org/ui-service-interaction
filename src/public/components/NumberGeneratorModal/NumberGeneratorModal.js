import { forwardRef, useCallback, useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';

import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';

import orderBy from 'lodash/orderBy';
import isEqual from 'lodash/isEqual';

import {
  QueryTypedown,
  generateKiwtQueryParams,
  highlightString
} from '@k-int/stripes-kint-components';
import { Button, Layout, Modal, ModalFooter } from '@folio/stripes/components';

import { InfoBox } from '@folio/stripes-erm-components';

import { AT_MAXIMUM, BELOW_THRESHOLD, OVER_THRESHOLD } from '../../constants';
import { useNumberGeneratorSequences, useNumberGenerators } from '../../hooks';
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
  const intl = useIntl();
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

  // FIXME Can grab this from results list
/*   const sequenceCount = useMemo(() => data.reduce((acc, curr) => {
    return acc + curr?.sequences?.length;
  }, 0), [data]); */

  // Manage the object states separately to the "select" state.
  const [selectedSequence, setSelectedSequence] = useState();

  useEffect(() => {
    if (!isStandaloneSequencesFetching) {
      if (standaloneSequences.length > 0 && !selectedSequence) {
        setSelectedSequence(standaloneSequences[0]);
      } else {
        const selectedSequenceInData = standaloneSequences?.filter(sq => sq.id === selectedSequence?.id)?.[0];
        console.log("SS: %o", selectedSequence);
        console.log("SSID: %o", selectedSequenceInData);

        if (!!selectedSequenceInData && !isEqual(selectedSequence, selectedSequenceInData)) {
          // Refetched SS differs, setSS
          setSelectedSequence(selectedSequenceInData);
        }
      }
    }
  }, [isStandaloneSequencesFetching, selectedSequence, standaloneSequences]);

  const overThreshold = useMemo(() => selectedSequence?.maximumCheck?.value === OVER_THRESHOLD, [selectedSequence?.maximumCheck?.value]);
  const atMaximum = useMemo(() => selectedSequence?.maximumCheck?.value === AT_MAXIMUM, [selectedSequence?.maximumCheck?.value]);

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
        <Layout className="display-flex">
          {highlightString(
            input,
            intl.formatMessage(
              { id: 'ui-service-interaction.numberGenerator.modal.sequenceName' },
              {
                name: sequence.name,
              }
            )
          )}
        </Layout>
        <Layout className={`display-flex ${css.boldItem} ${css.itemMargin}`}>
          <FormattedMessage id="ui-service-interaction.separator" />
        </Layout>
        <Layout className={`display-flex ${css.greyItem} ${css.itemMargin}`}>
          {highlightString(
            input,
            intl.formatMessage(
              { id: 'ui-service-interaction.numberGenerator.modal.sequenceCode' },
              {
                code: sequence.code,
              }
            )
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
