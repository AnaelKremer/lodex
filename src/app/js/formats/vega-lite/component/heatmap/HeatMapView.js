import React, { Component } from 'react';
import { CustomActionVegaLite } from '../vega-component';
import injectData from '../../../injectData';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import HeatMap from '../../models/HeatMap';
import { field as fieldPropTypes } from '../../../../propTypes';
import PropTypes from 'prop-types';
import ContainerDimensions from 'react-container-dimensions';

const styles = {
    container: {
        overflow: 'hidden',
        userSelect: 'none',
    },
};

class HeatMapView extends Component {
    render() {
        const heatMap = new HeatMap();

        heatMap.setColor(this.props.colorScheme.join(' '));
        heatMap.flipAxis(this.props.flipAxis);
        heatMap.setTooltip(this.props.tooltip);
        heatMap.setTooltipCategory(this.props.tooltipSource);
        heatMap.setTooltipTarget(this.props.tooltipTarget);
        heatMap.setTooltipValue(this.props.tooltipWeight);

        const spec = heatMap.buildSpec();

        return (
            <div style={styles.container}>
                <ContainerDimensions>
                    {({ width }) => {
                        spec.width = width * (width <= 800 ? 0.5 : 0.7);
                        spec.height = width * (width <= 800 ? 0.5 : 0.7);
                        return (
                            <CustomActionVegaLite
                                spec={spec}
                                data={this.props.data}
                            />
                        );
                    }}
                </ContainerDimensions>
            </div>
        );
    }
}

HeatMapView.propTypes = {
    field: fieldPropTypes.isRequired,
    resource: PropTypes.object.isRequired,
    data: PropTypes.any,
    colorScheme: PropTypes.arrayOf(PropTypes.string).isRequired,
    flipAxis: PropTypes.bool.isRequired,
    tooltip: PropTypes.bool.isRequired,
    tooltipSource: PropTypes.string.isRequired,
    tooltipTarget: PropTypes.string.isRequired,
    tooltipWeight: PropTypes.string.isRequired,
};

HeatMapView.defaultProps = {
    className: null,
};

const mapStateToProps = (state, { formatData }) => {
    if (!formatData) {
        return {};
    }
    return {
        data: {
            values: formatData,
        },
    };
};

export default compose(injectData(), connect(mapStateToProps))(HeatMapView);
