const numberGenerator1 = {
  id: 'number-generator-1',
  code: 'numberGen1',
  name: 'Number generator 1',
  sequences: [
    {
      id: 'ng1-seq1',
      code: 'seq1.1',
      name: 'sequence 1.1',
      enabled: true
    },
    {
      id: 'ng1-seq2',
      code: 'seq1.2',
      name: 'sequence 1.2',
      enabled: true
    },
    {
      id: 'ng1-seq3',
      code: 'seq1.3',
      enabled: true
    }
  ]
};

const numberGenerator2 = {
  id: 'number-generator-2',
  code: 'numberGen2',
  name: 'Number generator 2',
  sequences: [
    {
      id: 'ng2-seq1',
      code: 'seq2.1',
      name: 'sequence 2.1',
      enabled: true
    },
    {
      id: 'ng2-seq2',
      code: 'seq2.2',
      name: 'sequence 2.2',
      enabled: false
    },
    {
      id: 'ng2-seq3',
      code: 'seq2.3',
      name: 'sequence 2.3',
      enabled: true
    }
  ]
};

export {
  numberGenerator1,
  numberGenerator2
};
