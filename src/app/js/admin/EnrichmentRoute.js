import React from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import withInitialData from './withInitialData';

import { Route, useRouteMatch, Switch } from 'react-router';
import EnrichmentForm from './enrichment/EnrichmentForm';
import EnrichmentSelect from './enrichment/EnrichmentSelect';

export const EnrichmentRouteComponent = () => {
    let { path } = useRouteMatch();

    return (
        <Switch>
            <Route exact path={`${path}/add`}>
                <EnrichmentForm />
            </Route>
            <Route exact path={`${path}/:enrichmentId`}>
                <EnrichmentForm isEdit />
            </Route>
            <Route>
                <EnrichmentSelect />
            </Route>
        </Switch>
    );
};

EnrichmentRouteComponent.propTypes = {};

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

export const EnrichmentRoute = compose(
    withInitialData,
    connect(mapStateToProps, mapDispatchToProps),
    translate,
)(EnrichmentRouteComponent);