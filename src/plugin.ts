import * as minimatch from 'minimatch';
import * as HtmlWebpackPlugin from 'html-webpack-plugin';

export class HtmlWebpackLinkTypePlugin {

    mimeTypeMap = {
        '*.css': 'text/css',
        '*.js': 'text/javascript',
        '*.png': 'image/png',
        '*.jpg': 'image/jpeg',
        '*.jpeg': 'image/jpeg',
        '*.gif': 'image/gif',
        '*.webp': 'image/webp',
        '*.bmp': 'image/bmp',
    };

    constructor(typeMap?: {[key:  string]: string}) {
        if (typeMap) {
            this.mimeTypeMap = {...this.mimeTypeMap, ...typeMap};
        }
    }

    apply(compiler) {
        if (compiler.hooks) {
            // webpack 4 support
            compiler.hooks.compilation.tap('LinkTypePlugin', (compilation) => {
                if (compilation.hooks.htmlWebpackPluginAlterAssetTags) {
                    // html webpack 3
                    compilation.hooks.htmlWebpackPluginAlterAssetTags.tapAsync(
                        'LinkTypePlugin',
                        (data, cb) => {
                            data.head = this._transformAssets(data.head);
                            data.body = this._transformAssets(data.body);
                            return cb(null, data);
                        }
                    )
                } else if (HtmlWebpackPlugin && HtmlWebpackPlugin['getHooks']) {
                    // html-webpack 4
                    const hooks = (HtmlWebpackPlugin as any).getHooks(compilation);
                    hooks.alterAssetTags.tapAsync(
                        'LinkTypePlugin',
                        (data, cb) => {
                            data.assetTags.scripts = this._transformAssets(data.assetTags.scripts);
                            data.assetTags.styles = this._transformAssets(data.assetTags.styles);
                            data.assetTags.meta = this._transformAssets(data.assetTags.meta);
                            return cb(null, data);
                        }
                    )
                } else {
                    throw new Error('Cannot find appropriate compilation hook');
                }
            });
        } else {
            // Hook into the html-webpack-plugin processing
            compiler.plugin('compilation', function (compilation) {
                compilation.plugin('html-webpack-plugin-alter-asset-tags', (htmlPluginData, callback) => {
                    htmlPluginData.head = this._transformAssets(htmlPluginData.head);
                    htmlPluginData.body = this._transformAssets(htmlPluginData.body);
                    return callback(null, htmlPluginData);
                });
            });
        }
    }

    private _transformAssets(assets: any[]): any[]  {
        const links = assets
        .filter(e => e.tagName && e.tagName === 'link')
        .filter(e => e.attributes && e.attributes.href);

        links.forEach(l => {
            const type = this._findMimeType(l.attributes.href);
            if (type && type.length) {
                l.attributes.type=type;
            }
        });
        return links;
    }

    private _findMimeType(filename: string): string {
        const typeKeys = Object.keys(this.mimeTypeMap);
        for (let i =0; i<typeKeys.length; i++) {
            const typeGlob = typeKeys[i];
            if (minimatch(filename, typeGlob)) {
                return this.mimeTypeMap[typeGlob];
            }
        }
    }
}