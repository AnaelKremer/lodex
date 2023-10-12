import React from 'react';
import AceEditor from 'react-ace';
import { formField as formFieldPropTypes } from '../../propTypes';
import 'ace-builds/src-noconflict/mode-ini';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-monokai';

const FormSourceCodeField = ({
    input,
    label,
    p,
    dispatch,
    mode = 'ini',
    ...custom
}) => {
    return (
        <AceEditor
            mode={mode}
            theme="monokai"
            wrapEnabled={true}
            fontSize={14}
            value={input.value}
            onChange={input.onChange}
            {...custom}
        />
    );
};

FormSourceCodeField.propTypes = formFieldPropTypes;

export default FormSourceCodeField;
