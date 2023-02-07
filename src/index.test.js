import { renderWithIntl } from '@folio/stripes-erm-testing';

import translationsProperties from '../test/helpers/translationsProperties';

import App from './index';

const mockAddKey = jest.fn();

jest.mock('./settings', () => () => <div>Settings</div>);
jest.mock('@k-int/stripes-kint-components', () => ({
  useIntlKeyStore: () => mockAddKey
}));

describe('App', () => {
  let renderComponent;
  describe('App acting as not-settings', () => {
    beforeEach(async () => {
      mockAddKey.mockReset();
      renderComponent = renderWithIntl(
        <App
          actAs="test"
        />,
        translationsProperties
      );
    });

    test('Add key has been called', () => {
      expect(mockAddKey).toHaveBeenCalledTimes(1);
    });

    test('The settings do not render', () => {
      const { queryByText } = renderComponent;
      expect(queryByText('Settings')).not.toBeInTheDocument();
    });
  });

  describe('App acting as settings', () => {
    beforeEach(async () => {
      mockAddKey.mockReset();
      renderComponent = renderWithIntl(
        <App
          actAs="settings"
        />,
        translationsProperties
      );
    });

    test('Add key has been called', () => {
      expect(mockAddKey).toHaveBeenCalledTimes(1);
    });

    test('The settings do render', () => {
      const { queryByText } = renderComponent;
      expect(queryByText('Settings')).toBeInTheDocument();
    });
  });
});
