import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import translate from 'redux-polyglot/translate';
import {
    schemeBlues,
    schemeOrRd,
    schemeBuGn,
    schemeBuPu,
    schemeGnBu,
    schemeGreys,
    schemeOranges,
    schemeGreens,
    schemePuBu,
    schemePuBuGn,
    schemePuRd,
    schemeRdPu,
    schemeYlGn,
    schemeYlGnBu,
    schemeYlOrBr,
    schemeYlOrRd,
} from 'd3-scale-chromatic';
import { scaleQuantize } from 'd3-scale';
import TextField from 'material-ui/TextField';

import ColorScalePreview from './ColorScalePreview.js';

const schemes = [
    schemeBlues[9],
    schemeOrRd[9],
    schemeBuGn[9],
    schemeBuPu[9],
    schemeGnBu[9],
    schemeGreys[9],
    schemeOranges[9],
    schemeGreens[9],
    schemePuBu[9],
    schemePuBuGn[9],
    schemePuRd[9],
    schemeRdPu[9],
    schemeYlGn[9],
    schemeYlGnBu[9],
    schemeYlOrBr[9],
    schemeYlOrRd[9],
];

import { polyglot as polyglotPropTypes } from '../../propTypes';

const styles = {
    container: {
        display: 'flex',
        flexWrap: 'wrap',
        width: '200%',
        justifyContent: 'space-between',
    },
    input: {
        marginLeft: '1rem',
        width: '40%',
    },
    input2: {
        width: '100%',
    },
    previewDefaultColor: color => ({
        display: 'inline-block',
        backgroundColor: color,
        height: '1em',
        width: '1em',
        marginLeft: 5,
        border: 'solid 1px black',
    }),
};

class CartographyAdmin extends Component {
    static propTypes = {
        colorScheme: PropTypes.arrayOf(PropTypes.string),
        hoverColorScheme: PropTypes.arrayOf(PropTypes.string),
        defaultColor: PropTypes.string,
        onChange: PropTypes.func.isRequired,
        p: polyglotPropTypes.isRequired,
    };

    static defaultProps = {
        colorScheme: schemeOrRd[9],
        hoverColorScheme: schemeBlues[9],
        defaultColor: '#f5f5f5',
    };
    constructor(props) {
        super(props);
        const { colorScheme, hoverColorScheme, defaultColor } = this.props;
        this.state = { colorScheme, hoverColorScheme, defaultColor };
    }

    setDefaultColor = (_, defaultColor) => {
        const { params, ...state } = this.state;
        const newState = { ...state, defaultColor };
        this.setState(newState);
        this.props.onChange(newState);
    };

    setColorScheme = (_, __, colorScheme) => {
        const newState = { ...this.state, colorScheme: colorScheme.split(',') };
        this.setState(newState);
        this.props.onChange(newState);
    };

    setHoverColorScheme = (_, __, hoverColorScheme) => {
        const newState = {
            ...this.state,
            hoverColorScheme: hoverColorScheme.split(','),
        };
        this.setState(newState);
        this.props.onChange(newState);
    };

    render() {
        const { p: polyglot } = this.props;
        const { colorScheme, hoverColorScheme, defaultColor } = this.state;

        return (
            <div style={styles.container}>
                <TextField
                    floatingLabelText={
                        <span>
                            {polyglot.t('default_color')}
                            <span
                                style={styles.previewDefaultColor(defaultColor)}
                            />
                        </span>
                    }
                    onChange={this.setDefaultColor}
                    style={styles.input}
                    underlineStyle={{ borderColor: defaultColor }}
                    underlineFocusStyle={{ borderColor: defaultColor }}
                    value={defaultColor}
                />
                <SelectField
                    floatingLabelText={polyglot.t('color_scheme')}
                    onChange={this.setColorScheme}
                    style={styles.input}
                    value={colorScheme.join(',')}
                >
                    {schemes.map(value => (
                        <MenuItem
                            key={value}
                            value={value.join(',')}
                            primaryText={
                                <ColorScalePreview
                                    colorScale={scaleQuantize()
                                        .domain([0, 100])
                                        .range(value)}
                                />
                            }
                        />
                    ))}
                </SelectField>
                <SelectField
                    floatingLabelText={polyglot.t('hover_color_scheme')}
                    onChange={this.setHoverColorScheme}
                    style={styles.input}
                    value={hoverColorScheme.join(',')}
                >
                    {schemes.map(value => (
                        <MenuItem
                            key={value}
                            value={value.join(',')}
                            primaryText={
                                <ColorScalePreview
                                    colorScale={scaleQuantize()
                                        .domain([0, 100])
                                        .range(value)}
                                />
                            }
                        />
                    ))}
                </SelectField>
            </div>
        );
    }
}

export default translate(CartographyAdmin);