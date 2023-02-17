import { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import isEqual from 'lodash/isEqual';
import orderBy from 'lodash/orderBy';

import { useCallout } from '@folio/stripes/core';

import {
  Button,
  ConfirmationModal,
  KeyValue,
  MultiColumnList,
  Pane,
  Select
} from '@folio/stripes/components';
import { FormModal } from '@k-int/stripes-kint-components';

import { useNumberGenerators, useMutateNumberGeneratorSequence } from '../public';
import NumberGeneratorSequence from './NumberGeneratorSequence';
import NumberGeneratorSequenceForm from './NumberGeneratorSequenceForm';

const EDITING = 'editing';
const CREATING = 'creating';

const NumberGeneratorSequenceConfig = ({
  history,
  match
}) => {
  const { data: { results: data = [] } = {}, isLoading } = useNumberGenerators();
  const [numberGenerator, setNumberGenerator] = useState({});

  const [selectedSequence, setSelectedSequence] = useState();
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState(false);

  const [formMode, setFormMode] = useState();

  const callout = useCallout();

  const findNumberGenerator = useCallback((ngId) => {
    return data?.find(ng => ng?.id === ngId);
  }, [data]);

  // Once data has loaded, default selected number generator to top of list
  useEffect(() => {
    if (!numberGenerator?.id && !isLoading && data?.length) {
      setNumberGenerator(data[0]);
      // All this handling is so we don't need to make a secondary call for the selected generator,
      // when we already have all the information from the initial fetch to populate the select.
    } else if (numberGenerator?.id) {
      const currentNumberGenerator = findNumberGenerator(numberGenerator.id);

      if (!isEqual(numberGenerator, currentNumberGenerator)) {
        setNumberGenerator(currentNumberGenerator);
      }
    }
  }, [data, findNumberGenerator, isLoading, numberGenerator]);

  const {
    put: editSeq,
    post: addSeq,
    delete: removeSeq
  } = useMutateNumberGeneratorSequence({
    afterQueryCalls: {
      delete: () => {
        callout.sendCallout({
          message: <FormattedMessage
            id="ui-service-interaction.settings.numberGeneratorSequences.callout.delete"
            values={{ name: selectedSequence.code }}
          />
        });
      },
      put: (res, putValues) => {
        // If we already have the sequence pane open, set it again so we have up to date data
        // If the pane is _not_ open, we don't need to do this
        if (selectedSequence) {
          setSelectedSequence(res.sequences.find(seq => seq.code === putValues.code));
        }
        setFormMode();
        callout.sendCallout({
          message: <FormattedMessage
            id="ui-service-interaction.settings.numberGeneratorSequences.callout.edit"
            values={{ name: selectedSequence.code }}
          />
        });
      },
      post: (res, postValues) => {
        setSelectedSequence(res.sequences.find(seq => seq.code === postValues.code));
        setFormMode();
        callout.sendCallout({
          message: <FormattedMessage
            id="ui-service-interaction.settings.numberGeneratorSequences.callout.create"
            values={{ name: postValues.code }}
          />
        });
      },
    },
    id: numberGenerator?.id
  });


  const sortedNumberGenSequences = useMemo(() => orderBy(numberGenerator?.sequences, ['enabled', 'code'], ['desc', 'asc']) ?? [], [numberGenerator?.sequences]);

  return (
    <>
      <Pane
        defaultWidth="fill"
        dismissible
        id="settings-numberGeneratorSequences-list"
        lastMenu={
          <Button
            buttonStyle="primary"
            marginBottom0
            onClick={() => setFormMode(CREATING)}
          >
            <FormattedMessage id="ui-service-interaction.new" />
          </Button>
        }
        onClose={() => history.push(match.url)}
        paneTitle={<FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences" />}
      >
        <Select
          dataOptions={[...data?.map(ng => ({ value: ng.id, label: ng.name }))]}
          label={<FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.generator" />}
          onChange={e => setNumberGenerator(findNumberGenerator(e.target.value))}
          value={numberGenerator.id}
        />
        <KeyValue
          label={<FormattedMessage id="ui-service-interaction.settings.numberGenerators.sequences" />}
          value={
            <MultiColumnList
              columnMapping={{
                name: <FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.name" />,
                code: <FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.code" />,
                enabled: <FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.enabled" />,
                nextValue: <FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.nextValue" />,
              }}
              contentData={sortedNumberGenSequences}
              formatter={{
                enabled: (rowData) => (
                  rowData?.enabled ?
                    <FormattedMessage id="ui-service-interaction.true" /> :
                    <FormattedMessage id="ui-service-interaction.false" />
                ),
                nextValue: (rowData) => (
                  rowData.nextValue ?? 0
                ),
              }}
              id="number-generator-sequences"
              interactive
              onRowClick={(_e, row) => { setSelectedSequence(row); }}
              visibleColumns={['name', 'code', 'nextValue', 'enabled']}
            />
          }
        />
      </Pane>
      {
        selectedSequence &&
          <NumberGeneratorSequence
            onClose={() => setSelectedSequence()}
            onDelete={() => setShowDeleteConfirmationModal(true)}
            sequence={selectedSequence}
            setEditing={() => setFormMode(EDITING)}
          />
      }
      {formMode &&
        <FormModal
          initialValues={formMode === CREATING ?
            {
              nextValue: 1,
            } :
            {
              ...selectedSequence,
            }
          }
          modalProps={{
            dismissible: true,
            label: formMode === CREATING ?
              <FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.newModal" /> :
              <FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.editModal" />,
            onClose: () => setFormMode(),
            open: (formMode === CREATING || formMode === EDITING)
          }}
          onSubmit={formMode === CREATING ? addSeq : editSeq}
        >
          <NumberGeneratorSequenceForm />
        </FormModal>
      }
      <ConfirmationModal
        buttonStyle="danger"
        confirmLabel={
          <FormattedMessage id="ui-service-interaction.delete" />
        }
        heading={
          <FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.deleteSequence" />
        }
        message={[
          <FormattedMessage
            key="delete-sequence-message"
            id="ui-service-interaction.settings.numberGeneratorSequences.deleteSequence.message"
            values={{ name: selectedSequence?.code }}
          />,
          <br key="delete-sequence-line-break" />,
          <FormattedMessage
            key="delete-sequence-warning-message"
            id="ui-service-interaction.settings.numberGeneratorSequences.deleteSequence.warningMessage"
          />
        ]}
        onCancel={() => setShowDeleteConfirmationModal(false)}
        onConfirm={() => {
          removeSeq(selectedSequence?.id);
          setSelectedSequence();
          setShowDeleteConfirmationModal(false);
        }}
        open={showDeleteConfirmationModal}
      />
    </>
  );
};

NumberGeneratorSequenceConfig.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }),
  match: PropTypes.shape({
    url: PropTypes.string.isRequired
  })
};

export default NumberGeneratorSequenceConfig;
