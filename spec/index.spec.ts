import {join} from 'path';
import * as webpack from 'webpack';
import * as HtmlWebpackPlugin from 'html-webpack-plugin';
import * as rimraf from 'rimraf';
import * as MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { testAutoAssign, testTypeOverride } from "./tests.spec";
import {HtmlWebpackLinkTypePlugin} from '../src/plugin';


export const OUTPUT_DIR = join(__dirname, './test_dist');


const
    HtmlWebpackPluginOptions = {
        filename: join(OUTPUT_DIR, './index.html'),
        hash: false,
        inject: 'body',
        minify: {
            collapseWhitespace: true,
            removeComments: true,
            removeRedundantAttributes: true,
            useShortDoctype: true
        },
        showErrors: false,
        template: join(__dirname, './test_data/index.html'),
    },

    webpackDevOptions: webpack.Configuration = {
        mode: 'development',
        entry: {
            app: join(__dirname, './test_data/entry.js'),
            styles: join(__dirname, './test_data/entry.css'),
        },
        output: {
            path: OUTPUT_DIR
        },
        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader
                        },
                        {
                            loader: 'css-loader'
                        },
                    ]
                }
            ]
        },
    },

    webpackProdOptions: webpack.Configuration = {...webpackDevOptions,
        mode: 'production',
    };


describe('HtmlWebpackLinkTypePlugin Development Mode', () => {

    beforeEach((done) => {
        rimraf(OUTPUT_DIR, done);
    });

    it('should auto assign types to css and js', function (done) {
        webpack({ ...webpackDevOptions,
            plugins: [
                new HtmlWebpackPlugin(HtmlWebpackPluginOptions),
                new HtmlWebpackLinkTypePlugin(),
                new MiniCssExtractPlugin ({
                    filename: '[name].css'
                }),
            ]
        }, (err) => {
            testAutoAssign( err );
            done();
        });
    });

    it('should allow type overrides', function (done) {
        webpack({ ...webpackDevOptions,
            plugins: [
                new HtmlWebpackPlugin(HtmlWebpackPluginOptions),
                new HtmlWebpackLinkTypePlugin({
                    '*.css': 'testtype'
                }),
                new MiniCssExtractPlugin ({
                    filename: '[name].css'
                }),
            ]
        }, (err) => {
            testTypeOverride(err);
            done();
        });
    });
});


describe('HtmlWebpackLinkTypePlugin Production Mode', () => {

    beforeEach((done) => {
        rimraf(OUTPUT_DIR, done);
    });

    it('should auto assign types to css and js', function (done) {
        webpack({ ...webpackProdOptions,
            plugins: [
                new HtmlWebpackPlugin(HtmlWebpackPluginOptions),
                new HtmlWebpackLinkTypePlugin(),
                new MiniCssExtractPlugin ({
                    filename: '[name].css'
                }),
            ]
        }, (err) => {
            testAutoAssign( err );
            done();
        });
    });

    it('should allow type overrides', function (done) {
        webpack({ ...webpackProdOptions,
            plugins: [
                new HtmlWebpackPlugin(HtmlWebpackPluginOptions),
                new HtmlWebpackLinkTypePlugin({
                    '*.css': 'testtype'
                }),
                new MiniCssExtractPlugin ({
                    filename: '[name].css'
                }),
            ]
        }, (err) => {
            testTypeOverride(err);
            done();
        });
    });
});
