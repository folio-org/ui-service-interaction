import { renderWithIntl } from '@folio/stripes-erm-testing';
import Settings from './index';

import { translationsProperties } from '../../test/helpers';
import { screen, within } from '@folio/jest-config-stripes/testing-library/react';

// Mocks for Number generator settings pages
jest.mock('./NumberGeneratorConfig', () => () => <div>NumberGeneratorConfigComponent</div>);
jest.mock('./NumberGeneratorSequenceRoute', () => () => <div>NumberGeneratorSequenceRoute</div>);

jest.mock('@folio/stripes/smart-components', () => ({
  Settings: ({ sections }) => {
    const sectionsRender = sections.map(((section, sectionIndex) => (
      <div
        key={`section-${sectionIndex}`}
        data-testid={`section-${sectionIndex}`}
        id={`section-${sectionIndex}`}
      >
        <div>
          Section test
        </div>
        <div>
          {section.label}
        </div>
        <div>
          {section.pages?.map((page, pageIndex) => (
            <div
              key={`section-${sectionIndex}-page-${pageIndex}`}
              data-testid={`section-${sectionIndex}-page-${pageIndex}`}
              id={`section-${sectionIndex}-page-${pageIndex}`}
            >
              <div>Settings page test</div>
              {/* render the setting component to get test coverage --- idk why we don't need to then test it */}
              <div>{page?.component()}</div>
            </div>
          ))}
        </div>
      </div>
    )));

    return (
      <div>
        <div>
          Settings component test
        </div>
        <div>
          {sectionsRender}
        </div>
      </div>
    );
  }
}));

// EXAMPLE one example of how we might test settings pages, although I'm not best pleased with this atm
describe('Settings', () => {
  let renderComponent;
  beforeEach(async () => {
    renderComponent = renderWithIntl(
      <Settings />,
      translationsProperties
    );
  });

  test('renders settings component', () => {
    const { getByText } = renderComponent;
    expect(getByText('Settings component test')).toBeInTheDocument();
  });

  test('renders 1 section', () => {
    const { queryAllByText } = renderComponent;
    expect(queryAllByText('Section test')).toHaveLength(1);
  });

  describe.each([
    {
      sectionIndex: 0,
      sectionLabel: 'Number generators',
      numberOfPages: 2,
      pageTestStrings: ['NumberGeneratorConfigComponent', 'NumberGeneratorSequenceRoute']
    }
  ])('renders section $sectionLabel as expected', ({ sectionIndex, sectionLabel, numberOfPages, pageTestStrings }) => {
    test('renders section label', () => {
      const { getByText } = renderComponent;
      expect(getByText(sectionLabel)).toBeInTheDocument();
    });

    test(`renders ${numberOfPages} settings pages`, () => {
      expect(within(screen.getByTestId(`section-${sectionIndex}`)).queryAllByText('Settings page test')).toHaveLength(numberOfPages);
    });

    test.each(pageTestStrings)('renders settings page %s', (pageTestString) => {
      expect(within(screen.getByTestId(`section-${sectionIndex}`)).getByText(pageTestString)).toBeInTheDocument();
    });
  });
});
