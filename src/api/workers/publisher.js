import Queue from 'bull';
import publish from '../services/publish';
import publishFacets from '../controller/api/publishFacets';
import publishCharacteristics from '../services/publishCharacteristics';
import publishDocuments from '../services/publishDocuments';
import repositoryMiddleware from '../services/repositoryMiddleware';

export const PUBLISH = 'publish';
const listeners = [];
export const publisherQueue = new Queue('publisher', process.env.REDIS_URL, {
    defaultJobOptions: { removeOnComplete: 100, removeOnFail: 100, lifo: true },
});

publisherQueue.process(PUBLISH, (job, done) => {
    publisherQueue.clean(100, 'wait');
    startPublishing(job)
        .then(() => {
            job.progress(100);
            notifyListeners(false);
            done();
        })
        .catch(err => {
            handlePublishError();
            done(err);
        });
});

const startPublishing = async job => {
    notifyListeners(true);
    const ctx = await prepareContext({ job });
    await publish(ctx);
};

const handlePublishError = async () => {
    notifyListeners(false);
    const ctx = await prepareContext({});
    await ctx.publishedDataset.remove({});
    await ctx.publishedCharacteristic.remove({});
};

const prepareContext = async ctx => {
    await repositoryMiddleware(ctx, () => Promise.resolve());
    ctx.publishDocuments = publishDocuments;
    ctx.publishCharacteristics = publishCharacteristics;
    ctx.publishFacets = publishFacets;
    return ctx;
};

export const addPublisherListener = listener => listeners.push(listener);
const notifyListeners = isPublishing =>
    listeners.forEach(listener => listener({ isPublishing }));
