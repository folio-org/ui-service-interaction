
import App from './index';
import { renderWithTranslations } from '../test/helpers';

const mockAddKey = jest.fn();

jest.mock('./settings', () => () => <div>Settings</div>);
jest.mock('@k-int/stripes-kint-components', () => ({
  useIntlKeyStore: () => mockAddKey
}));

// EXAMPLE testing that settings renders... this is mostly useless in this module
describe('App', () => {
  let renderComponent;

  describe.each([
    {
      actAs: 'test',
      doSettingsRender: false
    },
    {
      actAs: 'settings',
      doSettingsRender: true
    },
  ])('rendering app with actAs: $actAs', ({ actAs, doSettingsRender }) => {
    beforeEach(async () => {
      mockAddKey.mockReset();
      renderComponent = renderWithTranslations(
        <App
          actAs={actAs}
        />
      );
    });

    test('Add key has been called', () => {
      expect(mockAddKey).toHaveBeenCalledTimes(1);
    });

    test(`The settings${doSettingsRender ? '' : ' do not'} render`, () => {
      const { queryByText } = renderComponent;
      if (doSettingsRender) {
        expect(queryByText('Settings')).toBeInTheDocument();
      } else {
        expect(queryByText('Settings')).not.toBeInTheDocument();
      }
    });
  });
});
