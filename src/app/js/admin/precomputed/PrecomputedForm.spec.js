import React from 'react';
import { shallow } from 'enzyme';
import { Field } from 'redux-form';
import { PrecomputedForm } from './PrecomputedForm';

const EXCERPT_LINES = [{ columnOne: 'TEST' }];

describe('<PrecomputedFormComponent />', () => {
    it('should render', () => {
        const wrapper = shallow(
            <PrecomputedForm
                p={{ t: () => {} }}
                excerptColumns={[]}
                excerptLines={EXCERPT_LINES}
            />,
        );
        expect(wrapper).toHaveLength(1);
    });

    it('should render a Field for name precomputed', () => {
        const wrapper = shallow(
            <PrecomputedForm
                p={{ t: () => {} }}
                excerptColumns={[]}
                excerptLines={EXCERPT_LINES}
            />,
        );
        const textField = wrapper.find(Field).at(0);
        expect(textField).toHaveLength(1);
        expect(textField.prop('name')).toEqual('name');
    });

    it('should render 2 Fields for precomputed rule', () => {
        const wrapper = shallow(
            <PrecomputedForm
                p={{ t: () => {} }}
                excerptColumns={[]}
                excerptLines={EXCERPT_LINES}
            />,
        );
        const webServiceUrl = wrapper.find(Field).at(2);
        expect(webServiceUrl).toHaveLength(1);
        expect(webServiceUrl.prop('name')).toEqual('webServiceUrl');

        const sourceColumns = wrapper.find(Field).at(3);
        expect(sourceColumns).toHaveLength(1);
        expect(sourceColumns.prop('name')).toEqual('sourceColumns');
    });

    it('should render a  precomputed logs dialog', () => {
        const initialValues = {
            advancedMode: false,
            _id: '123',
            status: 'IN_PROGRESS',
        };
        const wrapper = shallow(
            <PrecomputedForm
                p={{ t: () => {} }}
                excerptColumns={[]}
                initialValues={initialValues}
                isEdit={true}
                excerptLines={EXCERPT_LINES}
            />,
        );
        expect(wrapper.find('Translated(PrecomputedLogsDialog)')).toHaveLength(
            1,
        );
    });
});
