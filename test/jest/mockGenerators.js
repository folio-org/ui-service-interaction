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

const getMaximumCheckByValue = (val) => {
  const { values, ...rdcRest } = refdata?.find(rdc => rdc?.desc === 'NumberGeneratorSequence.MaximumCheck');
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

const numberGenerator3 = {
  id: '30f48059-b0b9-4434-8550-1aa12ea9b00f',
  sequences: [
    {
      id: '352d11b6-095b-44d6-a053-b733a9c7510a',
      code: 'b_test',
      nextValue: 1,
      name: 'B. Test',
      checkDigitAlgo: getCheckDigitAlgoByValue('none'),
      enabled: true
    },
    {
      id: 'aa0bf779-3622-4bae-8203-832824f599f8',
      code: 'a_test',
      nextValue: 1,
      name: 'A. Test',
      checkDigitAlgo: getCheckDigitAlgoByValue('none'),
      enabled: true
    },
    {
      id: '559e4451-7209-4353-9ce1-6cc9de85d026',
      code: 'efTest3',
      nextValue: 101,
      format: '###',
      name: 'EF Test 3',
      maximumNumber: 100,
      maximumCheck: getMaximumCheckByValue('at_maximum'),
      checkDigitAlgo: getCheckDigitAlgoByValue('none'),
      enabled: true
    },
    {
      id: 'fb15ef2b-76c8-47ef-826d-f7cbb763d34a',
      code: 'a_2_test',
      nextValue: 1,
      name: 'a. test',
      checkDigitAlgo: getCheckDigitAlgoByValue('none'),
      enabled: false
    },
    {
      id: '8c2bca3e-f677-4a9e-88e7-312eb8dd48dc',
      code: 'eftest1',
      nextValue: 50,
      maximumNumberThreshold: 95,
      format: '####',
      name: 'EF Test 1',
      maximumNumber: 100,
      maximumCheck: getMaximumCheckByValue('below_threshold'),
      checkDigitAlgo: getCheckDigitAlgoByValue('none'),
      enabled: true
    },
    {
      id: '42d5c637-6294-4f76-9e97-9c5f3c787834',
      code: 'efTest2',
      nextValue: 95,
      maximumNumberThreshold: 90,
      format: '####',
      name: 'EF Test 2',
      maximumNumber: 100,
      maximumCheck: getMaximumCheckByValue('over_threshold'),
      checkDigitAlgo: getCheckDigitAlgoByValue('none'),
      enabled: true
    },
    {
      id: '26b4378e-52d1-474d-b5d3-15af82ccd65d',
      code: 'b_2_test',
      nextValue: 1,
      name: 'b. test',
      checkDigitAlgo: getCheckDigitAlgoByValue('none'),
      enabled: true
    }
  ],
  code: 'ef_test_gen',
  name: 'EF Test Gen'
};

export {
  numberGenerator1,
  numberGenerator2,
  numberGenerator3
};
