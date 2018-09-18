import {join} from 'path';
import {readFileSync} from 'fs';
import * as webpack from 'webpack';
import * as HtmlWebpackPlugin from 'html-webpack-plugin';
import * as rimraf from 'rimraf';
import * as MiniCssExtractPlugin from 'mini-css-extract-plugin';
import {expect} from 'chai';
import {HtmlWebpackLinkTypePlugin} from '../src/plugin';

const OUTPUT_DIR = join(__dirname, './test_dist');

describe('HtmlWebpackLinkTypePlugin', () => {

    beforeEach((done) => {
        rimraf(OUTPUT_DIR, done);
    });

    it('should auto assign types to css and js', function (done) {
        webpack({
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
            plugins: [
                new HtmlWebpackPlugin({
                    filename: join(OUTPUT_DIR, './index.html'),
                    template: join(__dirname, './test_data/index.html'),
                    inject: 'body',
                    hash: false,
                    showErrors: false
                }),
                new HtmlWebpackLinkTypePlugin(),
                new MiniCssExtractPlugin ({
                    filename: '[name].css'
                }),
            ]
        }, (err, stats) => {
            expect(!!err).to.be.false;
            const htmlFile = join(OUTPUT_DIR, './index.html');
            const htmlContents = readFileSync(htmlFile).toString();
            expect(!!htmlContents).to.be.true;
            expect(/href="styles\.css"[^>]*?type="text\/css"/.test(htmlContents)).to.be.true;
            done();
        });
    });

    it('should allow type overrides', function (done) {
        webpack({
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
            plugins: [
                new HtmlWebpackPlugin({
                    filename: join(OUTPUT_DIR, './index.html'),
                    template: join(__dirname, './test_data/index.html'),
                    inject: 'body',
                    hash: false,
                    showErrors: false
                }),
                new HtmlWebpackLinkTypePlugin({
                    '*.css': 'testtype'
                }),
                new MiniCssExtractPlugin ({
                    filename: '[name].css'
                }),
            ]
        }, (err, stats) => {
            expect(!!err).to.be.false;
            const htmlFile = join(OUTPUT_DIR, './index.html');
            const htmlContents = readFileSync(htmlFile).toString();
            expect(!!htmlContents).to.be.true;
            expect(/href="styles\.css"[^>]*?type="testtype"/.test(htmlContents)).to.be.true;
            done();
        });
    });
});