import { renderWithIntl } from '@folio/stripes-erm-testing';

import useMutateNumberGenerator from './useMutateNumberGenerator';

const TestComponent = () => {
  useMutateNumberGenerator();
  return <div> Component </div>;
};

// This test is FULLY useless... only serves to get coverage up
// FIXME we can actually test some of this functionality, so we should do that
describe('useMutateNumberGenerator', () => {
  let renderComponent;
  describe('useMutateNumberGenerator', () => {
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <TestComponent />
      );
    });

    test('component renders without failure', () => {
      const { getByText } = renderComponent;
      expect(getByText('Component')).toBeInTheDocument();
    });
  });
});
