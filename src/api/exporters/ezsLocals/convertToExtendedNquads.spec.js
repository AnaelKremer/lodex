import request from 'request';
import ezs from 'ezs';
import from from 'from';
import sinon from 'sinon';
import btoa from 'btoa';
import { expect } from 'chai';

const dataTest = require('./fixture.data.json');
const dataNquads = require('./fixture.data.nq.json');
const ezsLocals = require('.');

const config = {
    istexQuery: {
        labels: '',
        linked: 'language',
        context: {
            language: 'http://purl.org/ontology/dc/language',
            doi: 'http://purl.org/ontology/bibo/doi',
        },
    },
};

ezs.use(ezsLocals);
describe('conversion to extended Nquads', () => {
    let sandbox;
    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        const s = sandbox.stub(request, 'get');
        s.onFirstCall().yields(null, { statusCode: 200 }, dataTest[0]);
        s.onSecondCall().yields(null, { statusCode: 200 }, dataTest[1]);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should return nquads from the dataset', (done) => {
    /* should result of the nquads conversion */
        /* Fake URL */
        from([{ lodex: { uri: 'https://lodex-uri.fr/URI' }, content: 'https://api-v5.istex.fr/document/?q=language:test' }])
        .pipe(ezs('scroll'))
        .pipe(ezs('convertToExtendedNquads', { graph: 'http://test-unit.fr', config }))
        .pipe(ezs((data, feed) => {
            if (data !== null) {
                try {
                    expect(dataNquads).to.contain(btoa(data));
                } catch (e) {
                    return done(e);
                }
            } else {
                return done();
            }
            return feed.end();
        }));
    });
});