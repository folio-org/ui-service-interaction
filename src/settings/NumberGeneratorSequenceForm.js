import { Field, useFormState } from 'react-final-form';

import { Col, Row, TextField } from '@folio/stripes/components';
import { FormattedMessage } from 'react-intl';

const NumberGeneratorSequenceForm = () => {
  const { values } = useFormState();

  return (
    <Row>
      <Col xs={6}>
        <Field
          component={TextField}
          disabled={!!values?.id}
          label={<FormattedMessage id="ui-service-interaction.settings.numberGeneratorSequences.code" />}
          name="code"
        />

      </Col>
    </Row>
  );
};

export default NumberGeneratorSequenceForm;
