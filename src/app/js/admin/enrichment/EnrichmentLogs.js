import React, { useContext, useEffect, useState } from 'react';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core';
import { EnrichmentContext } from './EnrichmentContext';
import { fromUser } from '../../sharedSelectors';
import { connect } from 'react-redux';
import theme from '../../theme';
import { io } from 'socket.io-client';
import { FINISHED } from '../../../../common/enrichmentStatus';

const useStyles = makeStyles({
    LogsContainer: {
        overflowY: 'auto',
    },
    LogsTitle: {
        fontSize: '1.2rem',
        fontWeight: 'bold',
    },
    Logs: {
        width: '100%',
        textAlign: 'left',
    },
    Log_info: {
        color: theme.black.light,
        lineHeight: '0.8rem',
    },
    Log_ok: {
        color: theme.green.primary,
        fontWeight: 'bold',
    },
    Log_error: {
        color: theme.red.primary,
        fontWeight: 'bold',
    },
});

export const EnrichmentLogsComponent = ({ p: polyglot, optionsRequest }) => {
    const { enrichment, onLoadEnrichments } = useContext(EnrichmentContext);

    const url =
        window.location.origin + `/api/job/log/enrichment/${enrichment?.jobId}`;
    const options = optionsRequest({
        url,
        method: 'GET',
    });

    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        enrichment?.jobId &&
            fetch(url, options)
                .then(res => res.json())
                .then(
                    result => {
                        setIsLoaded(true);
                        setLogs(result.logs.reverse());
                    },

                    error => {
                        setIsLoaded(true);
                        setError(error);
                    },
                );
    }, []);

    useEffect(() => {
        const socket = io();
        socket.on(`enrichment-job-${enrichment?.jobId}`, data => {
            setLogs(currentState => [data, ...currentState]);

            console.log(JSON.parse(data).status);
            if (JSON.parse(data).status === FINISHED) {
                console.log('ALLLEZZ')
                onLoadEnrichments();
            }
        });
        return () => socket.disconnect();
    }, []);

    const classes = useStyles();

    const renderLog = log => {
        const parsedLog = JSON.parse(log);

        let date;
        try {
            date = Intl.DateTimeFormat('fr', {
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
            }).format(new Date(parsedLog?.timestamp));
        } catch (e) {
            date = 'No date';
        }

        return (
            <p
                key={parsedLog.timestamp}
                className={classes[`Log_${parsedLog.level}`]}
            >
                [{date}] {parsedLog.message}
            </p>
        );
    };

    return enrichment?.jobId ? (
        <div className={classes.LogsContainer}>
            <div className={classes.LogsTitle}>Logs #{enrichment?.jobId}</div>
            <div className={classes.Logs}>
                {!isLoaded && <div>{polyglot.t('loading')}</div>}
                {isLoaded && error && (
                    <div>
                        {polyglot.t('error')}: {error.message}
                    </div>
                )}
                {isLoaded && !logs && <div>{polyglot.t('empty')}</div>}
                {isLoaded && logs && logs.map(log => renderLog(log))}
            </div>
        </div>
    ) : null;
};

EnrichmentLogsComponent.propTypes = {
    p: polyglotPropTypes.isRequired,
    optionsRequest: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    optionsRequest: request => fromUser.getRequest(state, request),
});

export default compose(
    translate,
    connect(mapStateToProps),
)(EnrichmentLogsComponent);
