import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import pure from 'recompose/pure';
import { Table, TableBody, TableHead, TableRow } from '@material-ui/core';

import { addField } from '../../fields';
import ParsingExcerptAddColumn from './ParsingExcerptAddColumn';
import ParsingExcerptColumn from './ParsingExcerptColumn';
import ParsingExcerptHeaderColumn from './ParsingExcerptHeaderColumn';
import { fromEnrichments } from '../selectors';
import theme from '../../theme';

const styles = {
    table: {
        display: 'block',
        overflowX: 'auto',
        width: 'auto',
        minWidth: '100%',
        borderLeft: '1px solid rgb(224, 224, 224)',
    },
    body: {
        position: 'relative',
    },
};

export const getRowStyle = (index, total) => {
    let opacity = 1;

    if (total > 2 && index === total - 2) {
        opacity = 0.45;
    }

    if (total > 2 && index === total - 1) {
        opacity = 0.25;
    }

    return { opacity, height: 36 };
};

export const isColumnEnrichment = (columns, enrichments) => {
    let arrayIsColumnEnrichment = [];
    columns.map(c => {
        arrayIsColumnEnrichment[c] = enrichments.find(e => e.name === c);
    });

    return arrayIsColumnEnrichment;
};

export const ParsingExcerptComponent = ({
    columns,
    handleAddColumn,
    lines,
    showAddColumns,
    enrichments,
}) => {
    const total = lines.length;
    const arrayIsColumnEnrichment = isColumnEnrichment(
        columns,
        enrichments,
    );

    return (
        <Table style={styles.table}>
            <TableHead>
                <TableRow>
                    {columns.map(column => (
                        <ParsingExcerptHeaderColumn
                            key={`header_${column}`}
                            column={column}
                            style={
                                arrayIsColumnEnrichment[column] && {
                                    backgroundColor: theme.green.light,
                                }
                            }
                        />
                    ))}
                </TableRow>
            </TableHead>
            <TableBody style={styles.body}>
                {lines.map((line, index) => (
                    <TableRow
                        key={`${line._id}_data_row`}
                        style={getRowStyle(index, total)}
                    >
                        {columns.map(column => {
                            const showAddColumnButton =
                                showAddColumns &&
                                showAddColumns &&
                                (index === total - 3 ||
                                    (total < 3 && index === 0));

                            return (
                                <ParsingExcerptColumn
                                    key={`${column}_${line._id}`}
                                    value={`${line[column] || ''}`}
                                    style={
                                        arrayIsColumnEnrichment[column] && {
                                            backgroundColor: theme.green.light,
                                        }
                                    }
                                >
                                    {showAddColumnButton && (
                                        <ParsingExcerptAddColumn
                                            key={`add_column_${column}`}
                                            name={column}
                                            onAddColumn={handleAddColumn}
                                            atTop={total < 3}
                                        />
                                    )}
                                </ParsingExcerptColumn>
                            );
                        })}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

ParsingExcerptComponent.propTypes = {
    columns: PropTypes.arrayOf(PropTypes.string).isRequired,
    lines: PropTypes.arrayOf(PropTypes.object).isRequired,
    handleAddColumn: PropTypes.func.isRequired,
    showAddColumns: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
    enrichments: fromEnrichments.enrichments(state),
});

const mapDispatchToProps = {
    handleAddColumn: name => addField({ name }),
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    pure,
)(ParsingExcerptComponent);
