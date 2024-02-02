import { waitFor } from '@folio/jest-config-stripes/testing-library/react';

import { Button, renderWithIntl } from '@folio/stripes-erm-testing';

import { translationsProperties } from '../../../test/helpers';

import {
  ChecksumAlgoInfo,
  CodeInfo,
  EnabledInfo,
  FormatInfo,
  NameInfo,
  NextValueInfo,
  OutputTemplateInfo
} from './InfoPopovers';

const expectedText = {
  ChecksumAlgoInfo: 'The check method for the check digit. Select “None” for no checksum calculation - please see documentation for further information on checksum.',
  CodeInfo: 'Unique code of the number generator sequence. This must be unique within the number generator and contain no whitespaces. Once set, this field can no longer be changed.',
  EnabledInfo: 'An enabled number generator sequence will be displayed when selecting the sequence in the App UI. A sequence with the status false will not be displayed in the App UI until it is enabled again.',
  FormatInfo: 'The Format field defines the length of the generated number. Use # to define the length without padding, e.g. "####". Or use a character to include padding. E.g. "0000" will set the length to 4 and add zeros to produce outputs such as 0045.',
  NameInfo: 'Name of the number generator sequence. In cases where a selection from number sequences is required, this name will be displayed in the Modal for generating a new number. This field is editable.',
  NextValueInfo: 'This field shows the <strong>next value</strong> in the sequence based on the current value in the database. It can be set manually as the starting value for a new sequence.',
  OutputTemplateInfo: 'The output template defines the rules applied to create the sequence. Templates are formed using Groovy. See below for more information.'
};

describe('InfoPopovers', () => {
  let renderedComponent;
  describe('ChecksumAlgoInfo', () => {
    beforeEach(async () => {
      renderedComponent = renderWithIntl(
        <ChecksumAlgoInfo />,
        translationsProperties
      );

      await waitFor(async () => {
        await Button().click();
      });
    });

    test('correct formatted message is rendered', () => {
      const { getByText } = renderedComponent;
      expect(getByText(expectedText.ChecksumAlgoInfo)).toBeInTheDocument();
    });
  });

  describe('CodeInfo', () => {
    beforeEach(async () => {
      renderedComponent = renderWithIntl(
        <CodeInfo />,
        translationsProperties
      );

      await waitFor(async () => {
        await Button().click();
      });
    });

    test('correct formatted message is rendered', () => {
      const { getByText } = renderedComponent;
      expect(getByText(expectedText.CodeInfo)).toBeInTheDocument();
    });
  });

  describe('EnabledInfo', () => {
    beforeEach(async () => {
      renderedComponent = renderWithIntl(
        <EnabledInfo />,
        translationsProperties
      );

      await waitFor(async () => {
        await Button().click();
      });
    });

    test('correct formatted message is rendered', () => {
      const { getByText } = renderedComponent;
      expect(getByText(expectedText.EnabledInfo)).toBeInTheDocument();
    });
  });

  describe('FormatInfo', () => {
    beforeEach(async () => {
      renderedComponent = renderWithIntl(
        <FormatInfo />,
        translationsProperties
      );

      await waitFor(async () => {
        await Button().click();
      });
    });

    test('correct formatted message is rendered', () => {
      const { getByText } = renderedComponent;
      expect(getByText(expectedText.FormatInfo)).toBeInTheDocument();
    });
  });

  describe('NameInfo', () => {
    beforeEach(async () => {
      renderedComponent = renderWithIntl(
        <NameInfo />,
        translationsProperties
      );

      await waitFor(async () => {
        await Button().click();
      });
    });

    test('correct formatted message is rendered', () => {
      const { getByText } = renderedComponent;
      expect(getByText(expectedText.NameInfo)).toBeInTheDocument();
    });
  });

  describe('NextValueInfo', () => {
    beforeEach(async () => {
      renderedComponent = renderWithIntl(
        <NextValueInfo />,
        translationsProperties
      );

      await waitFor(async () => {
        await Button().click();
      });
    });

    test('correct formatted message is rendered', () => {
      const { getByText } = renderedComponent;
      expect(getByText(expectedText.NextValueInfo)).toBeInTheDocument();
    });
  });

  describe('OutputTemplateInfo', () => {
    beforeEach(async () => {
      renderedComponent = renderWithIntl(
        <OutputTemplateInfo />,
        translationsProperties
      );

      await waitFor(async () => {
        await Button().click();
      });
    });

    test('correct formatted message is rendered', () => {
      const { getByText } = renderedComponent;
      expect(getByText(expectedText.OutputTemplateInfo)).toBeInTheDocument();
    });

    test('learn more button is rendered with correct href', async () => {
      await Button('Learn more').exists();
      await Button('Learn more').has({ href: 'https://docs.folio.org/docs/settings/settings_service_interaction/settings_service_interaction' });
    });
  });
});
