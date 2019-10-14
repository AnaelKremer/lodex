import React from 'react';
import { shallow } from 'enzyme';
import Subheader from 'material-ui/Subheader';

import FieldInput from './FieldInput';
import { CompositeFieldInputComponent as CompositeFieldInput } from './CompositeFieldInput';

describe('CompositeEditDetailsField', () => {
    it('should render EditDetailsField for root field and each composite fields', () => {
        const props = {
            label: 'Field',
            rootField: 'field',
            compositeFields: ['field1', 'field2'],
        };
        const wrapper = shallow(<CompositeFieldInput {...props} />);
        const editField = wrapper.find(FieldInput);
        expect(editField.length).toBe(3);
        expect(editField.at(0).props()).toEqual({ field: 'field' });
        expect(editField.at(1).props()).toEqual({ field: 'field1' });
        expect(editField.at(2).props()).toEqual({ field: 'field2' });
    });

    it('should render Subheader with label', () => {
        const props = {
            label: 'Field',
            rootField: 'field',
            compositeFields: ['field1', 'field2'],
        };
        const wrapper = shallow(<CompositeFieldInput {...props} />);
        const subheader = wrapper.find(Subheader);
        expect(subheader.length).toBe(1);
        expect(
            subheader
                .at(0)
                .children()
                .text(),
        ).toBe('Field');
    });
});
