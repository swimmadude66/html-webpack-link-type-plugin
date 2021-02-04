# Html Webpack Link Type Plugin
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fsteadyapp%2Fhtml-webpack-link-type-plugin.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fsteadyapp%2Fhtml-webpack-link-type-plugin?ref=badge_shield)

![build-plugin](https://github.com/swimmadude66/html-webpack-link-type-plugin/workflows/build-plugin/badge.svg?branch=master)

[![NPM](https://nodei.co/npm/html-webpack-link-type-plugin.png?compact=true)](https://npmjs.org/package/html-webpack-link-type-plugin)


_Assigns a mimetype to link tags injected by [Html Webpack Plugin](https://github.com/jantimon/html-webpack-plugin)_

## Configuration

1. Install via `npm i -D html-webpack-link-type-plugin`
1. Add to your webpack config AFTER HtmlWebpackPlugin
```javascript
    var LinkTypePlugin = require('html-webpack-link-type-plugin').HtmlWebpackLinkTypePlugin;
    ...
    plugins: [
        new HtmlWebpackPlugin({
            filename: join(OUTPUT_DIR, './dist/index.html'),
            hash: false,
            inject: 'body',
            minify: minifyOptions,
            showErrors: false
            template: join(__dirname, './src/index.html'),
        }),
        new LinkTypePlugin(options)
    ]
```

The plugin supports one optional configuration argument, called `typeMap`. It is an override to the default mapping of file globs (provided via [minimatch](https://github.com/isaacs/minimatch)). The default mapping is:

```javascript
    {
        '*.css' : 'text/css',
        '*.js'  : 'text/javascript',
        '*.png' : 'image/png',
        '*.jpg' : 'image/jpeg',
        '*.jpeg': 'image/jpeg',
        '*.gif' : 'image/gif',
        '*.webp': 'image/webp',
        '*.bmp' : 'image/bmp',
    };
```

## Notes

By default, `HTMLWebpackPlugin` automatically applies certain optimizations in production mode. Some of these optimizations may remove type attributes in injected links.

To prevent this, you will need to pass your own options to `HTMLWebpackPlugin`'s `minify` property, making sure to omit `removeStyleLinkTypeAttributes` and `removeScriptTypeAttributes`. Starting from `HTMLWebpackPlugin`'s default minify options, that might look like this:

```
plugins: [
        new HtmlWebpackPlugin({
            minify: {
                collapseWhitespace: true,
                removeComments: true,
                removeRedundantAttributes: true,
                useShortDoctype: true
            }
        }),
    ]
```


## Testing
Testing is done via ts-node and mocha. Test files can be found in `/spec`, and will be auto-discovered as long as the file ends in `.spec.ts`. Just run `npm test` after installing to see the tests run.


## License
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fsteadyapp%2Fhtml-webpack-link-type-plugin.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fsteadyapp%2Fhtml-webpack-link-type-plugin?ref=badge_large)
