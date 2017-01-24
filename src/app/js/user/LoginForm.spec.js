import React from 'react';
import expect from 'expect';
import { shallow } from 'enzyme';
import { Field } from 'redux-form';

import Alert from '../lib/Alert';
import { LoginFormComponent } from './LoginForm';

describe('<LoginForm />', () => {
    it('should render', () => {
        const wrapper = shallow(<LoginFormComponent handleSubmit={() => {}} />);
        expect(wrapper.length).toEqual(1);
    });

    it('should render error', () => {
        const wrapper = shallow(<LoginFormComponent error="Foo" handleSubmit={() => {}} />);
        const alerts = wrapper.find(Alert);
        expect(alerts.length).toEqual(1);
        expect(alerts.children().html()).toEqual('<p>Foo</p>');
    });

    it('should render a Field for username', () => {
        const wrapper = shallow(<LoginFormComponent handleSubmit={() => {}} />);
        const textField = wrapper.find(Field).at(0);
        expect(textField.length).toEqual(1);
        expect(textField.prop('name')).toEqual('username');
    });

    it('should render a Field for password', () => {
        const wrapper = shallow(<LoginFormComponent handleSubmit={() => {}} />);
        const textField = wrapper.find(Field).at(1);
        expect(textField.length).toEqual(1);
        expect(textField.prop('name')).toEqual('password');
    });
});
