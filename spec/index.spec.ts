import {join} from 'path';
import {readFileSync} from 'fs';
import {expect} from 'chai';
import * as webpack from 'webpack';
import * as HtmlWebpackPlugin from 'html-webpack-plugin';
import * as rimraf from 'rimraf';
import {HtmlWebpackLinkTypePlugin} from '../src/plugin';

const OUTPUT_DIR = join(__dirname, './test_dist');

const webpackPackageVersion = process.env.npm_package_devDependencies_webpack?.replace(/[^0-9.]/g, '')
const htmlPluginPackageVersion = process.env.npm_package_devDependencies_html_webpack_plugin?.replace(/[^0-9.]/g, '')

const webpackVersion = webpack.version ?? webpackPackageVersion
const htmlPluginVersion = HtmlWebpackPlugin.version ?? htmlPluginPackageVersion

console.log('\nWEBPACK VERSION', webpackVersion,'\n');
console.log('\nHTML-WEBPACK_PLUGIN VERSION', htmlPluginVersion,'\n');

let cssRule;
let cssPlugin;
let cssPluginOpts;
let addMode = true;

if (/^\s*[3]/.test(webpackVersion)) {
    // use extractTextWebpackPlugin
    const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
    cssRule = ExtractTextWebpackPlugin.extract({
        fallback: 'style-loader',
        use: 'css-loader'
    });
    cssPlugin = ExtractTextWebpackPlugin;
    cssPluginOpts = '[name].css'
    addMode = false;
} else {
    const MiniCssExtractPlugin = require('mini-css-extract-plugin');
    cssRule = [
        {
            loader: MiniCssExtractPlugin.loader
        },
        {
            loader: 'css-loader'
        },
    ];
    cssPlugin = MiniCssExtractPlugin;
    cssPluginOpts = {
        filename: '[name].css'
    };
}

const HtmlWebpackPluginOptions: HtmlWebpackPlugin.Options = {
    filename: 'index.html',
    hash: false,
    inject: true,
    minify: {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        useShortDoctype: true
    },
    showErrors: true,
    template: join(__dirname, './test_data/index.html'),
};


const webpackDevOptions: webpack.Configuration = {
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
                use: cssRule
            }
        ]
    },
};

const webpackProdOptions: webpack.Configuration = {
    ...webpackDevOptions
};

if (addMode) {
    webpackDevOptions.mode = 'development'
    webpackProdOptions.mode = 'production'
}

function testAutoAssign(err) {
    if (err) {
        console.error(err)
    }
    expect(!!err).to.be.false;
    const htmlFile = join(OUTPUT_DIR, './index.html');
    const htmlContents = readFileSync(htmlFile).toString('utf8');
    expect(!!htmlContents, 'Missing HTML contents').to.be.true;
    expect(/href="styles\.css"[^>]*?type="text\/css"/i.test(htmlContents), 'Missing labeled styles output').to.be.true;
    expect(/src="app\.js"/i.test(htmlContents), 'No app.js file appended to html').to.be.true;
}


function testTypeOverride(err) {
    if (err) {
        console.error(err)
    }
    expect(!!err).to.be.false;
    const htmlFile = join(OUTPUT_DIR, './index.html');
    const htmlContents = readFileSync(htmlFile).toString();
    expect(!!htmlContents, 'Missing HTML contents!').to.be.true;
    expect(/href="styles\.css"[^>]*?type="testtype"/i.test(htmlContents), 'Incorrect type applied or type not found').to.be.true;
    expect(/src="app\.js"/i.test(htmlContents), 'No app.js file appended to html').to.be.true;
}

describe('HtmlWebpackLinkTypePlugin Development Mode', () => {

    afterEach((done) => {
        rimraf(OUTPUT_DIR, done);
    });

    it('should auto assign types to css and js', (done) => {
        webpack({ ...webpackDevOptions,
            plugins: [
                new cssPlugin(cssPluginOpts),
                new HtmlWebpackPlugin(HtmlWebpackPluginOptions),
                new HtmlWebpackLinkTypePlugin(),
            ]
        }, (err) => {
            testAutoAssign( err );
            done(err);
        });
    })

    it('should allow type overrides', (done) => {
        webpack({
            ...webpackDevOptions,
            plugins: [
                new HtmlWebpackPlugin(HtmlWebpackPluginOptions),
                new HtmlWebpackLinkTypePlugin({
                    '*.css': 'testtype'
                }),
                new cssPlugin(cssPluginOpts),
            ]
        }, (err) => {
            testTypeOverride(err);
            done(err);
        });
    });
});

if (addMode) {
    describe('HtmlWebpackLinkTypePlugin Production Mode', () => {
        afterEach((done) => {
            rimraf(OUTPUT_DIR, done);
        });
    
        it('should auto assign types to css and js', (done) => {
            webpack({ ...webpackProdOptions,
                plugins: [
                    new HtmlWebpackPlugin(HtmlWebpackPluginOptions),
                    new HtmlWebpackLinkTypePlugin(),
                    new cssPlugin(cssPluginOpts),
                ]
            }, (err) => {
                testAutoAssign(err);
                done(err);
            });
        });
    
        it('should allow type overrides', (done) => {
            webpack({ ...webpackProdOptions,
                plugins: [
                    new HtmlWebpackPlugin(HtmlWebpackPluginOptions),
                    new HtmlWebpackLinkTypePlugin({
                        '*.css': 'testtype'
                    }),
                    new cssPlugin(cssPluginOpts),
                ]
            }, (err) => {
                testTypeOverride(err);
                done(err);
            });
        });
    });
}
