import { renderWithIntl } from '@folio/stripes-erm-testing';
import { render } from '@folio/jest-config-stripes/testing-library/react';
import translationsProperties from './translationsProperties';

export default (renderComponents, extraOptions) => renderWithIntl(renderComponents, translationsProperties, render, extraOptions);
