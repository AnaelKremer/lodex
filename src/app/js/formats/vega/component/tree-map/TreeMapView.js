import { field as fieldPropTypes } from '../../../../propTypes';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import injectData from '../../../injectData';
import TreeMap, { TREE_MAP_LAYOUT } from '../../models/TreeMap';
import React, { useMemo, useState } from 'react';
import { useSizeObserver } from '../../../utils/chartsHooks';
import {
    convertSpecTemplate,
    VEGA_ACTIONS_WIDTH,
    VEGA_DATA_INJECT_TYPE_C,
} from '../../../utils/chartsUtils';
import InvalidFormat from '../../../InvalidFormat';
import { CustomActionVega } from '../../../utils/components/vega-component';

const styles = {
    container: {
        overflow: 'hidden',
        userSelect: 'none',
    },
};

const TreeMapView = (props) => {
    const {
        data,
        field,
        advancedMode,
        advancedModeSpec,
        tooltip,
        tooltipCategory,
        tooltipValue,
        colors,
        layout,
        ratio,
        aspectRatio,
    } = props;

    const formattedData = useMemo(() => {
        if (!data) {
            return data;
        }

        let idIncrement = 0;
        /**
         * @type {Map<string, number>}
         */
        const ids = new Map();
        /**
         * @type {Map<string, {parent: number?, size: number?}>}
         */
        const tmpData = new Map();

        data.values.forEach((value) => {
            const parent = value.source;
            const name = value.target;
            const size = value.weight;

            if (!tmpData.has(parent)) {
                tmpData.set(parent, {});
                if (!ids.has(parent)) {
                    ids.set(parent, ++idIncrement);
                }
            }

            if (!ids.has(name)) {
                ids.set(name, ++idIncrement);
            }

            tmpData.set(name, {
                parent: ids.get(parent),
                size,
            });
        });

        const outputData = [];
        tmpData.forEach((value, key) => {
            outputData.push({
                id: ids.get(key),
                name: key,
                ...value,
            });
        });

        return {
            ...data,
            values: outputData,
        };
    }, [data]);

    const { ref, width } = useSizeObserver();
    const [error, setError] = useState('');

    const spec = useMemo(() => {
        if (advancedMode) {
            try {
                return convertSpecTemplate(
                    advancedModeSpec,
                    width - VEGA_ACTIONS_WIDTH,
                    width * 0.76,
                );
            } catch (e) {
                setError(e.message);
                return null;
            }
        }

        const specBuilder = new TreeMap();

        specBuilder.setColors(colors.split(' '));
        // specBuilder.setTooltip(tooltip);
        // specBuilder.setTooltipCategory(tooltipCategory);
        // specBuilder.setTooltipValue(tooltipValue);
        specBuilder.setRatio(ratio);
        specBuilder.setLayout(layout);

        return specBuilder.buildSpec(width);
    }, [
        width,
        advancedMode,
        advancedModeSpec,
        tooltip,
        tooltipCategory,
        tooltipValue,
        colors,
        layout,
        ratio,
    ]);

    if (spec === null) {
        return <InvalidFormat format={field.format} value={error} />;
    }

    return (
        <div style={styles.container} ref={ref}>
            <CustomActionVega
                spec={spec}
                data={formattedData}
                injectType={VEGA_DATA_INJECT_TYPE_C}
                aspectRatio={aspectRatio}
            />
        </div>
    );
};

TreeMapView.propTypes = {
    field: fieldPropTypes.isRequired,
    resource: PropTypes.object.isRequired,
    data: PropTypes.any,
    advancedMode: PropTypes.bool,
    advancedModeSpec: PropTypes.string,
    tooltip: PropTypes.bool,
    tooltipCategory: PropTypes.string,
    tooltipValue: PropTypes.string,
    colors: PropTypes.string,
    layout: PropTypes.oneOf(TREE_MAP_LAYOUT),
    ratio: PropTypes.number,
    aspectRatio: PropTypes.string,
};

TreeMapView.defaultProps = {
    className: null,
};

const mapStateToProps = (state, { formatData }) => {
    if (!formatData) {
        return {
            data: {
                values: [],
            },
        };
    }

    return {
        data: {
            values: formatData,
        },
    };
};

export const TreeMapAdminView = connect((state, props) => {
    return {
        ...props,
        field: {
            format: 'Preview Format',
        },
        data: {
            values: props.dataset.values ?? [],
        },
    };
})(TreeMapView);

export default compose(injectData(), connect(mapStateToProps))(TreeMapView);
