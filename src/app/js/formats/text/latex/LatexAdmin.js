import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@mui/material';
import translate from 'redux-polyglot/translate';
import { polyglot as polyglotPropTypes } from '../../../propTypes';
import { FormatDefaultParamsFieldSet } from '../../utils/components/field-set/FormatFieldSets';

export const defaultArgs = {
    delimiter: '',
};

class LatexAdmin extends Component {
    static propTypes = {
        args: PropTypes.shape({
            delimiter: PropTypes.string,
        }),
        onChange: PropTypes.func.isRequired,
        p: polyglotPropTypes.isRequired,
    };

    static defaultProps = {
        args: defaultArgs,
    };

    handleDelimiter = (e) => {
        const delimiter = String(e.target.value);
        const newArgs = { ...this.props.args, delimiter };
        this.props.onChange(newArgs);
    };

    render() {
        const {
            p: polyglot,
            args: { delimiter },
        } = this.props;

        return (
            <FormatDefaultParamsFieldSet>
                <TextField
                    label={polyglot.t('choose_delimiter')}
                    type="string"
                    onChange={this.handleDelimiter}
                    value={delimiter}
                    fullWidth
                />
            </FormatDefaultParamsFieldSet>
        );
    }
}

export default translate(LatexAdmin);
