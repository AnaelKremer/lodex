import Component from './SentenceView';
import AdminComponent, { defaultArgs } from './SentenceAdmin';
import DefaultFormat from '../../DefaultFormat';

export default {
    ...DefaultFormat,
    Component,
    ListComponent: Component,
    AdminComponent,
    defaultArgs,
};
