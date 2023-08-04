import { render } from '@folio/jest-config-stripes/testing-library/react';

import useSIRefdata from './useSIRefdata';
import mockRefdata from '../../test/jest/refdata';

const TestComponent = ({ returnQueryObject }) => {
  useSIRefdata({ returnQueryObject });
  return <div> Component </div>;
};


jest.mock('@k-int/stripes-kint-components', () => ({
  useRefdata: jest.fn(({ returnQueryObject = false }) => {
    if (!returnQueryObject) {
      return mockRefdata;
    }

    return ({
      data: mockRefdata
    });
  }),
  refdataOptions: {}
}));

// This test is FULLY useless... only serves to get coverage up
describe('useSIRefdata', () => {
  let renderComponent;
  describe('useSIRefdata', () => {
    beforeEach(() => {
      renderComponent = render(
        <TestComponent />
      );
    });

    test('component renders without failure', () => {
      const { getByText } = renderComponent;
      expect(getByText('Component')).toBeInTheDocument();
    });
  });

  describe('useSIRefdata with returnQueryObject', () => {
    beforeEach(() => {
      renderComponent = render(
        <TestComponent returnQueryObject />
      );
    });

    test('component renders without failure', () => {
      const { getByText } = renderComponent;
      expect(getByText('Component')).toBeInTheDocument();
    });
  });
});
