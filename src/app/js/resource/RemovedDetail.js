import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { CardHeader, CardText } from 'material-ui/Card';
import moment from 'moment';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';

import {
    getResourceLastVersion,
} from './';
import Card from '../lib/Card';
import { polyglot as polyglotPropTypes } from '../lib/propTypes';

const styles = {
    container: {
        display: 'flex',
        marginRight: '1rem',
    },
    reason: {
        fontWeight: 'bold',
    },
};

export const RemovedDetailComponent = ({ resource, p: polyglot }) => (
    <Card>
        <CardHeader>{polyglot.t('removed_resource_at', { date: moment(resource.removedAt).format('ll') })}</CardHeader>
        <CardText>
            <dl style={styles.container}>
                <dt style={styles.reason}>reason</dt>
                <dd>
                    {resource.reason.split('\n').map(line => <p>{line}</p>)}
                </dd>
            </dl>
        </CardText>
    </Card>
);

RemovedDetailComponent.defaultProps = {
    resource: {
        reason: '',
    },
};

RemovedDetailComponent.propTypes = {
    resource: PropTypes.shape({}),
    p: polyglotPropTypes.isRequired,
};

const mapStateToProps = state => ({
    resource: getResourceLastVersion(state),
});

const mapDispatchToProps = {};

export default compose(
    translate,
    connect(mapStateToProps, mapDispatchToProps),
)(RemovedDetailComponent);
