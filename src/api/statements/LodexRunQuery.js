import { MongoClient } from 'mongodb';
import config from 'config';
import ezs from 'ezs';
import set from 'lodash.set';
import publishedDataset from '../models/publishedDataset';
import field from '../models/field';

export const createFunction = MongoClientImpl =>
    async function LodexRunQuery(data, feed) {
        if (this.isLast()) {
            return feed.close();
        }
        const from = this.getParam('from', data.$from || 'dataset');
        const query = this.getParam('query', data.$query || {});
        const limit = this.getParam('limit', data.$limit || 10);
        const skip = this.getParam('skip', data.$skip || 0);
        const sort = this.getParam('sort', data.$sort || {});
        const target = this.getParam('total');

        const handleDb = await MongoClientImpl.connect(
            `mongodb://${config.mongo.host}/${config.mongo.dbName}`,
        );
        let handle;
        if (from === 'fields' || from === 'field') {
            handle = await field(handleDb);
        } else {
            handle = await publishedDataset(handleDb);
        }
        // Hide removed resources & prevent a public view
        query.removedAt = { $exists: false };

        const cursor = handle.find(query);
        const total = await cursor.count();
        const stream = cursor
            .skip(Number(skip))
            .limit(Number(limit))
            .sort(sort)
            .pipe(
                ezs((data1, feed1) => {
                    if (typeof data1 === 'object') {
                        if (data1) {
                            set(data1, `${target || 'total'}`, total);
                        }
                        feed.write(data1);
                    }
                    feed1.close();
                }),
            );
        stream.on('error', error => {
            feed.write(error);
        });
        stream.on('end', () => {
            handleDb.close();
            feed.close();
        });
    };

export default createFunction(MongoClient);
