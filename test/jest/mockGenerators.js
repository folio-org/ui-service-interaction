/* eslint-disable no-template-curly-in-string */
import refdata from './refdata';

const getCheckDigitAlgoByValue = (val) => {
  const { values, ...rdcRest } = refdata?.find(rdc => rdc?.desc === 'NumberGeneratorSequence.CheckDigitAlgo');
  const value = values?.find(rdv => rdv?.value === val);

  return {
    ...value,
    owner: rdcRest
  };
};

const numberGenerator1 = {
  id: 'number-generator-1',
  code: 'numberGen1',
  name: 'Number generator 1',
  sequences: [
    {
      id: 'ng1-seq1',
      checkDigitAlgo: getCheckDigitAlgoByValue('ean13'),
      code: 'seq1.1',
      description: 'this is a description',
      name: 'sequence 1.1',
      nextValue: 1,
      outputTemplate: 'sequence-1.1-${generated_number}-${checksum}',
      owner: {
        id: 'number-generator-1'
      },
      enabled: true
    },
    {
      id: 'ng1-seq3',
      checkDigitAlgo: getCheckDigitAlgoByValue('ean13'),
      code: 'seq1.3',
      nextValue: 1,
      outputTemplate: 'sequence-1.3-${generated_number}-${checksum}',
      owner: {
        id: 'number-generator-1'
      },
      enabled: true
    }, // Wrong order to try and force sorting logic to trigger in code coverage
    {
      id: 'ng1-seq2',
      checkDigitAlgo: getCheckDigitAlgoByValue('none'),
      code: 'seq1.2',
      name: 'sequence 1.2',
      nextValue: 1092,
      outputTemplate: 'sequence-1.2-${generated_number}-${checksum}',
      owner: {
        id: 'number-generator-1'
      },
      enabled: true
    },
  ]
};

const numberGenerator2 = {
  id: 'number-generator-2',
  code: 'numberGen2',
  name: 'Number generator 2',
  sequences: [
    {
      id: 'ng2-seq1',
      checkDigitAlgo: getCheckDigitAlgoByValue('none'),
      code: 'seq2.1',
      name: 'sequence 2.1',
      nextValue: 103,
      outputTemplate: 'sequence-2.1-${generated_number}-${checksum}',
      owner: {
        id: 'number-generator-2'
      },
      enabled: true
    },
    {
      id: 'ng2-seq2',
      checkDigitAlgo: getCheckDigitAlgoByValue('modulo16'),
      code: 'seq2.2',
      name: 'sequence 2.2',
      nextValue: 74,
      outputTemplate: 'sequence-2.2-${generated_number}-${checksum}',
      owner: {
        id: 'number-generator-2'
      },
      enabled: false
    },
    {
      id: 'ng2-seq3',
      checkDigitAlgo: getCheckDigitAlgoByValue('ean13'),
      code: 'seq2.3',
      name: 'sequence 2.3',
      nextValue: 1,
      outputTemplate: 'sequence-2.3-${generated_number}-${checksum}',
      owner: {
        id: 'number-generator-2'
      },
      enabled: true
    }
  ]
};

export {
  numberGenerator1,
  numberGenerator2
};
