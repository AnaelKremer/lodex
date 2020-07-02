import { Vega } from 'react-vega';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { isAdmin } from '../../../../user';

function CustomActionVegaLite(props) {
    let actions;
    if (isAdmin(props.user)) {
        actions = {
            export: {
                svg: true,
                png: true,
            },
            source: true,
            compiled: true,
            editor: true,
        };
    } else {
        actions = {
            export: {
                svg: true,
                png: true,
            },
            source: false,
            compiled: false,
            editor: false,
        };
    }

    let spec = props.spec;
    spec.data = props.data;

    return <Vega spec={spec} actions={actions} mode="vega-lite" />;
}

CustomActionVegaLite.propTypes = {
    user: PropTypes.any,
    spec: PropTypes.any.isRequired,
    data: PropTypes.any.isRequired,
};

const mapStateToProps = state => {
    return {
        user: state.user,
    };
};

export default connect(mapStateToProps)(CustomActionVegaLite);
