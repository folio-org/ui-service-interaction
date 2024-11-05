import { renderWithIntl } from '@folio/stripes-erm-testing';
import translationsProperties from './translationsProperties';

export default (renderComponents, extraOptions) => renderWithIntl(renderComponents, translationsProperties, extraOptions);
