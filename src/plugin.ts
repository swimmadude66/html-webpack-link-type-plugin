import * as minimatch from 'minimatch';

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
                compilation.hooks.htmlWebpackPluginAlterAssetTags.tapAsync(
                    'LinkTypePlugin',
                    (data, cb) => {
                        this._assignTypes(data, cb);
                    }
                )
            });
        } else {
            // Hook into the html-webpack-plugin processing
            compiler.plugin('compilation', function (compilation) {
                compilation.plugin('html-webpack-plugin-alter-asset-tags', (htmlPluginData, callback) => {
                    this._assignTypes(htmlPluginData, callback);
                });
            });
        }
    }

    private _assignTypes(data, cb) {
        const links = [...data.head, ...data.body]
        .filter(e => e.tagName && e.tagName === 'link')
        .filter(e => e.attributes && e.attributes.href);

        links.forEach(l => {
            const type = this._findMimeType(l.attributes.href);
            if (type && type.length) {
                l.attributes.type=type;
            }
        });
        return cb(null, data);
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