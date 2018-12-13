import from from 'from';
import ezs from 'ezs';
import ezsLodex from 'ezs-lodex';
import ezsIstex from 'ezs-istex';

ezs.use(ezsLodex);
ezs.use(ezsIstex);

/**
 * export data into the feed
 *
 * @param {object} data One LODEX document
 * @param {stream} feed N-Quads
 * @returns
 */
function ezsExport(data, feed) {
    const config = this.getParam('config');
    const fields = this.getParam('fields');

    if (this.isLast()) {
        return feed.close();
    }
    from([data])
        .pipe(ezs('filterVersions'))
        .pipe(ezs('filterContributions', { fields }))
        .pipe(ezs('extractIstexQuery', { fields, config }))
        .pipe(ezs('extract', { path: 'content' }))
        .pipe(
            ezs('ISTEXScroll', {
                field: Object.keys(config.istexQuery.context).filter(
                    e => e !== config.istexQuery.linked,
                ),
            }),
        )
        .pipe(ezs('ISTEXResult'))
        .pipe(
            ezs(function(d, f) {
                if (this.isLast()) {
                    return f.close();
                }
                const o = {
                    lodex: {
                        uri: data.uri,
                    },
                    content: d,
                };
                f.write(o);
                f.send();
            }),
        )
        .pipe(ezs('convertToExtendedJsonLd', { config }))
        .pipe(ezs('convertJsonLdToNQuads'))
        .on('data', d => {
            feed.send(d);
        })
        .on('close', () => feed.end())
        .on('error', err => {
            console.error(err);
            feed.stop(err);
        });
}

const exporter = (config, fields, characteristics, stream) => {
    return stream.pipe(ezs(ezsExport, { config, fields }));
};

exporter.extension = 'nq';
exporter.mimeType = 'application/n-quads';
exporter.type = 'file';
exporter.label = 'extendednquads';

export default exporter;
