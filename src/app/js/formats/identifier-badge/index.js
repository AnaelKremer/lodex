import IdentifierBadgeView from './IdentifierBadgeView';
import AdminComponent, { defaultArgs } from './IdentifierBadgeAdmin';
import DefaultFormat from '../DefaultFormat';

export default {
    ...DefaultFormat,
    Component: IdentifierBadgeView,
    ListComponent: IdentifierBadgeView,
    AdminComponent,
    defaultArgs,
    predicate: value =>
        value == null || value === '' || typeof value === 'string',
};

export const resolvers = {
    DOI: 'http://dx.doi.org/',
    DOAI: 'http://doai.io/',
    PMID: 'https://www.ncbi.nlm.nih.gov/pubmed/',
    HAL: 'https://hal.archives-ouvertes.fr/',
    UID: '/',
    ARK: '/',
};
