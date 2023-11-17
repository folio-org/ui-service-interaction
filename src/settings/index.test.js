import { renderWithIntl } from '@folio/stripes-erm-testing';
import Settings from './index';

import { translationsProperties } from '../../test/helpers';

jest.mock('./NumberGeneratorConfig', () => () => <div>NumberGeneratorConfigComponent</div>);
jest.mock('./NumberGeneratorSequenceRoute', () => () => <div>NumberGeneratorSequenceRoute</div>);

jest.mock('@folio/stripes/smart-components', () => ({
  Settings: ({ pages }) => {
    const pagesRender = pages?.map((page, pageIndex) => (
      <div
        key={`page-${pageIndex}`}
        data-testid={`page-${pageIndex}`}
        id={`page-${pageIndex}`}
      >
        Settings page
        {/* render the setting component to get test coverage --- idk why we don't need to then test it */}
        {page?.component()}
      </div>
    ));

    return (
      <div>
        Settings
        {pagesRender}
      </div>
    );
  }
}));

describe('Settings', () => {
  let renderComponent;
  describe('App acting as not-settings', () => {
    beforeEach(async () => {
      renderComponent = renderWithIntl(
        <Settings />,
        translationsProperties
      );
    });

    test('renders settings component', () => {
      const { getByText } = renderComponent;
      expect(getByText('Settings')).toBeInTheDocument();
    });

    test('renders 2 settings pages', () => {
      const { queryAllByText } = renderComponent;
      expect(queryAllByText('Settings page')).toHaveLength(2);
    });
  });
});
