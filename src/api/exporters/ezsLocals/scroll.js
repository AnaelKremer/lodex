import request from 'request';
import url from 'url';
import config from 'config';
import { httpLogger } from '../../services/logger';

/**
 * Recursive scroll
 *
 * @param uri   string  URI of the API query
 * @param data  Object  {content: uri, lodex: LODEX URI }
 * @param feed  Stream  stream managed with ezs
 */
function scrollR(uri, data, feed) {
    const options = {
        uri,
        json: true,
    };

    request.get(options, (error, response, body) => {
        const errorObj = {
            options,
            error,
            response: {
                statusCode: response.statusCode,
                statusMessage: response.statusMessage,
                headers: response.headers,
            },
        };
        let logLevel = 'warn';
        if (error || ![200, 500, 502, 503, 504].includes(response.statusCode)) {
            httpLogger.log(logLevel, errorObj);
            return feed.end();
        }

        // Case(s) when API replied, but we got no data (we lose data)
        if (response.statusCode === 502) {
            logLevel = 'error';
            errorObj.lodexMessage = 'Some data lost beyond proxy';
        }

        // We got an error, let's try again
        if ([500, 502, 503, 504].includes(response.statusCode)) {
            httpLogger.log(logLevel, errorObj);
            return setTimeout(scrollR, 500, uri, data, feed);
        }

        if (!body.total) {
            errorObj.lodexMessage = 'No results';
            httpLogger.log(logLevel, errorObj);
            // Go to next query
            return feed.end();
        }

        httpLogger.log('debug', `API query: ${url.parse(uri).query}`);

        feed.write({
            ...data.lodex,
            content: body,
        });

        if (body.noMoreScrollResults) {
            return feed.end();
        }

        const nextURI = body.nextScrollURI;

        if (nextURI) {
            return scrollR(nextURI, data, feed);
        }
        return feed.end();
    });
}

/**
 * Query the ISTEX API in scroll mode
 *
 * @param data  Object  {content: uri, lodex: LODEX URI }
 * @param feed  Stream  stream managed with ezs
 */
module.exports = function scroll(data, feed) {
    if (this.isLast()) {
        return feed.close();
    }

    /**
     * Parameters of the API query
     */
    const output = this.getParam('output', 'doi');
    const sid = this.getParam('sid', 'lodex');
    const size = this.getParam('size', 5000);
    const query = url.parse(data.content);

    const urlObj = {
        protocol: 'https',
        hostname: url.parse(config.istexApiUrl).hostname,
        pathname: 'document',
        // Change '&' to validate the query as an URI component (and not the '?'
        // at the beginning)
        search: `${query.search.replace(/&/g, '%26')}&scroll=30s&output=${output}&size=${size}&sid=${sid}`,
    };
    const uri = url.format(urlObj);

    return scrollR(uri, data, feed);
};