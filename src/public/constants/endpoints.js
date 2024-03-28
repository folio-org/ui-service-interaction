export const BASE_ENDPOINT = 'servint';
export const NUMBER_GENERATORS_ENDPOINT = `${BASE_ENDPOINT}/numberGenerators`;
export const NUMBER_GENERATOR_ENDPOINT = (id) => `${NUMBER_GENERATORS_ENDPOINT}/${id}`;

export const NUMBER_GENERATOR_SEQUENCES_ENDPOINT = `${BASE_ENDPOINT}/numberGeneratorSequences`;
export const NUMBER_GENERATOR_SEQUENCE_ENDPOINT = (id) => `${NUMBER_GENERATOR_SEQUENCES_ENDPOINT}/${id}`;
export const REFDATA_ENDPOINT = `${BASE_ENDPOINT}/refdata`;
