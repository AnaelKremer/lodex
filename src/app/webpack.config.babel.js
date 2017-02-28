import config from 'config';
import {
    optimize,
    DefinePlugin,
    LoaderOptionsPlugin,
    SourceMapDevToolPlugin,
    HotModuleReplacementPlugin,
    NamedModulesPlugin,
} from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import CompressionPlugin from 'compression-webpack-plugin';
import { resolve } from 'path';

const { UglifyJsPlugin } = optimize;

export default {
    entry: {
        index: [].concat(process.env.NODE_ENV === 'development' ? [
            'react-hot-loader/patch',
            'webpack-hot-middleware/client?path=/__webpack_hmr&reload=true',
        ] : []).concat([
            resolve(__dirname, './js/public/index.js'),
        ]),
        admin: [].concat(process.env.NODE_ENV === 'development' ? [
            'react-hot-loader/patch',
            'webpack-hot-middleware/client?path=/__webpack_hmr&reload=true',
        ] : []).concat([
            resolve(__dirname, './js/admin/index.js'),
        ]),
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                include: [
                    resolve(__dirname, './js'),
                    resolve(__dirname, '../common'),
                ],
                loader: 'babel-loader',
                options: {
                    forceEnv: 'browser',
                },
            }, {
                test: /\.json$/,
                loader: 'json-loader',
            }, {
                test: /\.jpe?g$|\.gif$|\.png$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: '[hash].[ext]',
                },
            }, {
                test: /\.(otf|svg)(\?.+)?$/,
                loader: 'url-loader',
                options: {
                    limit: 8192,
                },
            }, {
                test: /\.eot(\?\S*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    mimetype: 'application/vnd.ms-fontobject',
                },
            }, {
                test: /\.woff2(\?\S*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    mimetype: 'application/font-woff2',
                },
            }, {
                test: /\.woff(\?\S*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    mimetype: 'application/font-woff',
                },
            }, {
                test: /\.ttf(\?\S*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    mimetype: 'application/font-ttf',
                },
            },
        ],
    },
    output: {
        filename: '[name].js',
        path: resolve(__dirname, '../build'),
        publicPath: '/',
    },
    plugins: [
        // prints more readable module names in the browser console on HMR updates
        new NamedModulesPlugin(),

        new DefinePlugin({
            API_URL: JSON.stringify(config.api_url),
            'process.env': {
                NODE_ENV: process.env.NODE_ENV === 'development'
                    ? JSON.stringify(process.env.NODE_ENV)
                    : JSON.stringify('production'), // eslint-disable-line max-len
            },
        }),
        new LoaderOptionsPlugin({
            options: {
                debug: process.env.NODE_ENV === 'development',
                context: __dirname,
                minimize: process.env.NODE_ENV !== 'development',
            },
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: resolve(__dirname, './custom/index.html'),
            chunks: ['index'],
            inject: 'body',
        }),
        new HtmlWebpackPlugin({
            filename: 'admin/index.html',
            template: resolve(__dirname, './admin.html'),
            chunks: ['admin'],
            inject: 'body',
        }),
        new CopyWebpackPlugin([{
            from: resolve(__dirname, './custom'),
            to: resolve(__dirname, '../build'),
        }], {
            ignore: ['index.html', 'admin/index.js', 'index.js', '0.js'],
        }),
    ].concat(process.env.NODE_ENV === 'development'
        ? [
            new HotModuleReplacementPlugin(),
            new SourceMapDevToolPlugin({ filename: '[file].map' }),
        ]
        : [
            new UglifyJsPlugin({
                beautify: false,
                mangle: {
                    screw_ie8: true,
                    keep_fnames: true,
                },
                compress: {
                    screw_ie8: true,
                },
                comments: false,
                sourceMap: 'source-map',
            }),
            new CompressionPlugin(),
        ]),
    resolve: {
        extensions: ['.js', '.jsx'],
    },
};
