import { renderWithIntl } from '@folio/stripes-erm-testing';

import useMutateNumberGeneratorSequence from './useMutateNumberGeneratorSequence';

const TestComponent = () => {
  useMutateNumberGeneratorSequence();
  return <div> Component </div>;
};

// This test is FULLY useless... only serves to get coverage up
// FIXME we can actually test some of this functionality, so we should do that
describe('useMutateNumberGeneratorSequence', () => {
  let renderComponent;
  describe('useMutateNumberGeneratorSequence', () => {
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
