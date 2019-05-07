import {join} from 'path';
import {readFileSync} from 'fs';
import {expect} from 'chai';
import * as webpack from 'webpack';
import * as HtmlWebpackPlugin from 'html-webpack-plugin';
import * as rimraf from 'rimraf';
import * as MiniCssExtractPlugin from 'mini-css-extract-plugin';
import {HtmlWebpackLinkTypePlugin} from '../src/plugin';

const OUTPUT_DIR = join(__dirname, './test_dist');

const HtmlWebpackPluginOptions = {
    filename: 'index.html',
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
};

const webpackDevOptions: webpack.Configuration = {
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
};

const webpackProdOptions: webpack.Configuration = {
    ...webpackDevOptions,
    mode: 'production',
};

function testAutoAssign(err) {
    expect(!!err).to.be.false;
    const htmlFile = join(OUTPUT_DIR, './index.html');
    const htmlContents = readFileSync(htmlFile).toString('utf8');
    expect(!!htmlContents).to.be.true;
    expect(/href="styles\.css"[^>]*?type="text\/css"/i.test(htmlContents)).to.be.true;
    expect(/src="app\.js"/i.test(htmlContents)).to.be.true;
}


function testTypeOverride(err) {
    expect(!!err).to.be.false;
    const htmlFile = join(OUTPUT_DIR, './index.html');
    const htmlContents = readFileSync(htmlFile).toString();
    expect(!!htmlContents).to.be.true;
    expect(/href="styles\.css"[^>]*?type="testtype"/i.test(htmlContents)).to.be.true;
    expect(/src="app\.js"/i.test(htmlContents)).to.be.true;
}


describe('HtmlWebpackLinkTypePlugin Development Mode', () => {

    afterEach((done) => {
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
        webpack({
            ...webpackDevOptions,
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

    afterEach((done) => {
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
            testAutoAssign(err);
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
