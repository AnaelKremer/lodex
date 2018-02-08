import React from 'react';
import PropTypes from 'prop-types';
import { field as fieldPropTypes } from '../../propTypes';
import getLabel from '../shared/getLabel';

const LinkView = ({
    className,
    linkedResource,
    resource,
    field,
    fields,
    type,
    value,
}) => {
    const imageURL = getLabel(
        field,
        linkedResource,
        resource,
        fields,
        type,
        value,
    );
    const link = resource[field.name];
    return (
        <a className={className} href={`${link}`}>
            <img src={imageURL} />
        </a>
    );
};

LinkView.propTypes = {
    className: PropTypes.string,
    field: fieldPropTypes.isRequired,
    fields: PropTypes.arrayOf(fieldPropTypes).isRequired,
    linkedResource: PropTypes.object,
    resource: PropTypes.object.isRequired,
    type: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
};

LinkView.defaultProps = {
    className: null,
};

export default LinkView;