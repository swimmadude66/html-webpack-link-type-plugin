# Html Webpack Link Type Plugin
_Assigns a mimetype to link tags injected by [Html Webpack Plugin](https://github.com/jantimon/html-webpack-plugin)_

## Configuration

1. Install via `npm i -D html-webpack-link-type-plugin`
1. Add to your webpack config AFTER HtmlWebpackPlugin
```javascript
    plugins: [
        new HtmlWebpackPlugin({
            filename: join(OUTPUT_DIR, './dist/index.html'),
            template: join(__dirname, './src/index.html'),
            inject: 'body',
            hash: false,
            showErrors: false
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

## Testing
Testing is done via ts-node and mocha. Test files can be found in `/spec`, and will be auto-discovered as long as the file ends in `.spec.ts`. Just run `npm test` after installing to see the tests run.
