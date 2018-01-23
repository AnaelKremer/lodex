import expect from 'expect';

import { getUrl, parseFetchResult } from './fetchIstexData';

describe('fetchIstexData', () => {
    describe('getUrl', () => {
        it('should create istex url from given parameter', () => {
            expect(
                getUrl({
                    props: {
                        field: { name: 'name' },
                        resource: { name: 'value' },
                    },
                    page: 7,
                    perPage: 5,
                }),
            ).toEqual({
                url: 'https://istex/?q=value&from=35&size=5&output=id,arkIstex,title,publicationDate,author,host.genre,host.title'
            });
        });
    });

    describe('parseFetchResult', () => {
        it('should throw fetchResult.error if present', () => {
            const fetchResult = { error: new Error('Boom') };

            expect(() => parseFetchResult(fetchResult)).toThrow('Boom');
        });
    });
});
