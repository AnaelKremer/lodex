import React, { Component } from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';
import TextField from 'material-ui/TextField';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import updateAdminArgs from '../shared/updateAdminArgs';
import RoutineParamsAdmin from '../shared/RoutineParamsAdmin';
import ColorPickerParamsAdmin from '../shared/ColorPickerParamsAdmin';

import * as colorUtils from '../colorUtils';

const styles = {
    container: {
        display: 'flex',
        flexWrap: 'wrap',
        width: '200%',
        justifyContent: 'space-between',
    },
    input: {
        width: '100%',
    },
};

export const defaultArgs = {
    params: {
        maxSize: 5000,
        minimumScaleValue: 5,
    },
    maxLabelLength: 25,
    labelOffset: 50,
    colors: colorUtils.MONOCHROMATIC_DEFAULT_COLORSET,
};

class HierarchyAdmin extends Component {
    static propTypes = {
        args: PropTypes.shape({
            params: PropTypes.shape({
                maxSize: PropTypes.number,
                maxValue: PropTypes.number,
                minValue: PropTypes.number,
                orderBy: PropTypes.string,
            }),
        }),
        minimumScaleValue: PropTypes.number,
        maxLabelLength: PropTypes.number,
        labelOffset: PropTypes.number,
        colors: PropTypes.string,
        onChange: PropTypes.func.isRequired,
        p: polyglotPropTypes.isRequired,
    };

    static defaultProps = {
        args: defaultArgs,
    };

    constructor(props) {
        super(props);
        this.setColors = this.setColors.bind(this);
        this.state = {
            colors: this.props.colors || defaultArgs.colors,
        };
    }

    setParams = params => {
        updateAdminArgs('params', params, this.props);
    };

    setColors(colors) {
        updateAdminArgs(
            'colors',
            colors.split(' ')[0] || defaultArgs.colors,
            this.props,
        );
    }

    setMaxLabelLength = (_, maxLabelLength) => {
        this.setParams({
            maxLabelLength: parseInt(maxLabelLength, 10),
            labelOffset: this.props.labelOffset,
            maxSize: this.props.args.params.maxSize,
            minimumScaleValue: this.props.minimumScaleValue,
            maxValue: this.props.args.params.maxValue,
            minValue: this.props.args.params.minValue,
            orderBy: this.props.args.params.orderBy,
        });
    };

    setLabelOffset = (_, labelOffset) => {
        this.setParams({
            maxLabelLength: this.props.maxLabelLength,
            labelOffset: parseInt(labelOffset, 10),
            maxSize: this.props.args.params.maxSize,
            minimumScaleValue: this.props.minimumScaleValue,
            maxValue: this.props.args.params.maxValue,
            minValue: this.props.args.params.minValue,
            orderBy: this.props.args.params.orderBy,
        });
    };

    setMinimumScaleValue = (_, minimumScaleValue) => {
        this.setParams({
            maxLabelLength: this.props.maxLabelLength,
            labelOffset: this.props.labelOffset,
            maxSize: this.props.args.params.maxSize,
            minimumScaleValue: parseInt(minimumScaleValue, 10),
            maxValue: this.props.args.params.maxValue,
            minValue: this.props.args.params.minValue,
            orderBy: this.props.args.params.orderBy,
        });
    };

    render() {
        const {
            p: polyglot,
            args: { params },
        } = this.props;

        return (
            <div style={styles.container}>
                <RoutineParamsAdmin
                    params={params || defaultArgs.params}
                    polyglot={polyglot}
                    onChange={this.setParams}
                />
                <ColorPickerParamsAdmin
                    colors={this.state.colors || defaultArgs.colors}
                    onChange={this.setColors}
                    polyglot={polyglot}
                    monochromatic={true}
                />
                <TextField
                    floatingLabelText={polyglot.t('max_char_number_in_labels')}
                    onChange={this.setMaxLabelLength}
                    style={styles.input}
                    value={this.props.maxLabelLength}
                />
                <TextField
                    floatingLabelText={polyglot.t('label_offset')}
                    onChange={this.setLabelOffset}
                    style={styles.input}
                    value={this.props.labelOffset}
                />
                <TextField
                    floatingLabelText={polyglot.t('minimum_scale_value')}
                    onChange={this.setMinimumScaleValue}
                    style={styles.input}
                    value={this.props.minimumScaleValue}
                />
            </div>
        );
    }
}

export default translate(HierarchyAdmin);
