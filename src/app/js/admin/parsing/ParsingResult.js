import React, { Component } from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import { grey } from '@material-ui/core/colors';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import { reloadParsingResult } from './';
import { fromParsing } from '../selectors';
import ParsingExcerpt from './ParsingExcerpt';
import Loading from '../../lib/components/Loading';

const styles = {
    container: {
        position: 'relative',
        display: 'flex',
        maxHeight: 'calc(((100vh - 100px) - 76px) - 72px)',
    },
    card: {
        marginTop: 0,
    },
    content: {
        overflow: 'auto',
        display: 'flex',
    },
    list: {
        borderRight: `solid 1px ${grey[400]}`,
        listStyleType: 'none',
        margin: 0,
        padding: 0,
        paddingRight: '1rem',
    },
    listItem: {
        whiteSpace: 'nowrap',
    },
    button: {
        float: 'right',
        marginRight: '2rem',
    },
};

export class ParsingResultComponent extends Component {
    handleClearParsing = () => {
        event.preventDefault();
        event.stopPropagation();
        this.props.handleClearParsing();
    };

    render() {
        const {
            excerptColumns,
            excerptLines,
            p: polyglot,
            showAddFromColumn,
            onAddField,
            maxLines,
            loadingParsingResult,
        } = this.props;
        if (loadingParsingResult) {
            return (
                <Loading className="admin">
                    {polyglot.t('loading_parsing_results')}
                </Loading>
            );
        }

        return (
            <div className="parsingResult" style={styles.container}>
                <ParsingExcerpt
                    columns={excerptColumns}
                    lines={excerptLines.slice(0, maxLines)}
                    showAddFromColumn={showAddFromColumn}
                    onAddField={onAddField}
                />
            </div>
        );
    }
}

ParsingResultComponent.propTypes = {
    excerptColumns: PropTypes.arrayOf(PropTypes.string).isRequired,
    excerptLines: PropTypes.arrayOf(PropTypes.object).isRequired,
    p: polyglotPropTypes.isRequired,
    handleClearParsing: PropTypes.func.isRequired,
    showAddFromColumn: PropTypes.bool.isRequired,
    onAddField: PropTypes.func,
    maxLines: PropTypes.number,
    loadingParsingResult: PropTypes.bool.isRequired,
};

ParsingResultComponent.defaultProps = {
    maxLines: 10,
    showAddFromColumn: false,
};

const mapStateToProps = state => ({
    excerptColumns: fromParsing.getParsedExcerptColumns(state),
    excerptLines: fromParsing.getExcerptLines(state),
    loadingParsingResult: fromParsing.isParsingLoading(state),
});

const mapDispatchToProps = {
    handleClearParsing: reloadParsingResult,
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    translate,
)(ParsingResultComponent);
