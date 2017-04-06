import { promises as jsonld } from 'jsonld';
import path from 'path';
import omit from 'lodash.omit';
import { VALIDATED } from '../../common/propositionStatus';
import generateUid from '../services/generateUid';

const transformCompleteFields = async (field) => {
    const propertyName0 = await generateUid();
    const propertyName1 = field.name;
    const propertyName2 = field.completes;
    return [propertyName0, propertyName1, propertyName2];
};


export function filterVersions(data, feed) {
    if (data && data.versions) {
        const lastVersion = data.versions[data.versions.length - 1];
        delete data.versions;
        feed.send({
            ...data,
            ...lastVersion,
        });
    } else {
        feed.send(data);
    }
}

export function filterContributions(data, feed) {
    if (data && data.contributions) {
        const fieldsToIgnore = data.contributions
            .filter(({ status }) => status !== VALIDATED)
            .map(({ fieldName }) => fieldName)
            .concat('contributions', 'contributionCount');
        feed.send(omit(data, fieldsToIgnore));
    } else {
        feed.send(data);
    }
}

export function useFieldNames(data, feed) {
    const fields = this.getParam('fields', {});
    const output = {};
    if (this.isLast()) {
        feed.close();
    } else {
        fields.filter(field => field.cover === 'collection').forEach((field) => {
            output[field.label || field.name] = data[field.name];
        });
        feed.send(output);
    }
}

export function linkDataset(data, feed) {
    const uri = this.getParam('uri');
    const scheme = this.getParam('scheme', 'http://purl.org/dc/terms/isPartOf');
    if (uri && data && data['@context']) {
        data.dataset = uri;
        data['@context'].dataset = {
            '@id': scheme,
            //             '@type': 'https://www.w3.org/TR/xmlschema-2/#anyURI',
        };
    }
    feed.send(data);
}

export async function JSONLDObject(data, feed) {
    if (this.isLast()) {
        feed.close();
    } else {
        const output = {};

        if (data.uri.indexOf('http://') !== 0 &&
            data.uri.indexOf('https://') !== 0) {
            data.uri = path.normalize(this.getParam('hostname', 'http://lod.istex.fr/').concat(data.uri));
        }
        output['@id'] = data.uri;
        output['@context'] = {};

        const fields = this.getParam('fields', {});

        fields.filter(field => field.cover === 'collection').forEach((field) => {
            const propertyName = field.name;
            if (field.scheme && data[propertyName]) {
                output[propertyName] = data[propertyName];
                output['@context'][propertyName] = {};
                output['@context'][propertyName]['@id'] = field.scheme;
                if (field.type) {
                    output['@context'][propertyName]['@type'] = field.type;
                }
                if (field.language) {
                    output['@context'][propertyName]['@language'] = field.language;
                }
            }
        });

        const completesFields = fields
            .filter(field => field.completes)
            .map(transformCompleteFields);

        Promise.all(completesFields).then((propertyNames) => {
            propertyNames.forEach((field) => {
                const propertyName0 = field[0];
                const propertyName1 = field[1];
                const propertyName2 = field[2];
                output[propertyName0] = {};
                output[propertyName0][propertyName1] = data[propertyName1];
                output[propertyName0][propertyName2] = data[propertyName2];
                delete output[propertyName2];
                output['@context'][propertyName0] = {};
                output['@context'][propertyName0]['@id'] = output['@context'][propertyName2]['@id'];
                output['@context'][propertyName2]['@id'] = 'http://www.w3.org/2000/01/rdf-schema#label';
            });
            feed.send(output);
        });
    }
}


export function JSONLDString(data, feed) {
    if (this.isLast()) {
        feed.close();
    } else {
        jsonld.toRDF(data, { format: 'application/nquads' })
            .then((out) => {
                feed.send(out);
            },
                (err) => {
                    throw err;
                });
    }
}

