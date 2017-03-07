import { ObjectID } from 'mongodb';
import chunk from 'lodash.chunk';
import omit from 'lodash.omit';

import { VALIDATED, PROPOSED } from '../../common/propositionStatus';

export default (db) => {
    const collection = db.collection('publishedDataset');

    collection.insertBatch = documents => chunk(documents, 100).map(data => collection.insertMany(data));

    collection.findLimitFromSkip = (limit, skip, filter) =>
        collection.find(filter).skip(skip).limit(limit).toArray();

    collection.findPage = (page = 0, perPage = 10) =>
        collection.findLimitFromSkip(perPage, page * perPage, { removedAt: { $exists: false } });

    collection.findRemovedPage = (page = 0, perPage = 10) =>
        collection.findLimitFromSkip(perPage, page * perPage, { removedAt: { $exists: true } });

    collection.countRemoved = () =>
        collection.count({ removedAt: { $exists: true } });

    collection.countWithoutRemoved = () =>
        collection.count({ removedAt: { $exists: false } });

    collection.getFindAllStream = () =>
        collection.find({ removedAt: { $exists: false } }).stream();

    collection.findById = async (id) => {
        const oid = new ObjectID(id);
        return collection.findOne({ _id: oid });
    };

    collection.findByUri = async uri =>
        collection.findOne({ uri });

    collection.addVersion = async (resource, newVersion, publicationDate = new Date()) =>
        collection.update(
            { uri: resource.uri },
            {
                $push: {
                    versions: {
                        ...omit(newVersion, ['uri', '_id']),
                        publicationDate,
                    },
                },
            },
        );

    collection.hide = async (uri, reason, date = new Date()) =>
        collection.update({ uri }, { $set: {
            removedAt: date,
            reason,
        } });

    collection.restore = async uri =>
        collection.update({ uri }, { $unset: { removedAt: true, reason: true } });

    collection.addFieldToResource = async (uri, contributor, field, isLoggedIn, publicationDate = new Date()) => {
        const previousResource = await collection.findByUri(uri);

        const newVersion = {
            ...previousResource.versions[previousResource.versions.length - 1],
            [field.name]: field.value,
            publicationDate,
        };

        return collection.update({ uri }, {
            $addToSet: {
                contributions: {
                    fieldName: field.name,
                    contributor,
                    status: isLoggedIn ? VALIDATED : PROPOSED,
                },
            },
            $inc: isLoggedIn ? {
                [`contributionCount.${VALIDATED}`]: 1,
            } : {
                [`contributionCount.${PROPOSED}`]: 1,
            },
            $push: {
                versions: {
                    ...newVersion,
                    publicationDate,
                },
            },
        });
    };

    collection.getFieldStatus = async (uri, name) => {
        const result = await collection.aggregate([
            { $match: { uri } },
            { $unwind: '$contributions' },
            { $match: { 'contributions.fieldName': name } },
            { $project: { _id: 0, status: '$contributions.status' } },
        ]);

        if (!result) {
            return null;
        }

        return result.status;
    };

    collection.changePropositionStatus = async (uri, name, status) => {
        const previousStatus = await collection.getFieldStatus(uri, name);
        if (!previousStatus || previousStatus === status) {
            return;
        }

        await collection.update({
            uri,
            'contributions.fieldName': name,
        }, {
            $set: {
                'contributions.$.status': status,
            },
            $inc: {
                contributions: {
                    [status]: 1,
                    [previousStatus]: -1,
                },
            },
        });
    };

    return collection;
};
