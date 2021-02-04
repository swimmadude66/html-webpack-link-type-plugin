# 1.1.0 Verify support for webpack v5 and html-webpack-plugin v5
- No changes needed, package.json updated to reflect current dependency versions

# 1.0.4 Include .d.ts declaration files in package
- Addresses #15
- Remove testcases with Webpack 3 (compatability issues with mini-css-extract-plugin)

# 1.0.3 Handle production-mode defaults of webpack
- Added documentation around a potential pitfall when using production-mode webpack.
- Upgraded test dependencies
- Fixed peerDependency version syntax

# 1.0.2 Don't remove non-links
Fixed an issue where non-links were being removed, rather than left alone.

# 1.0.1 HtmlWebpackPlugin v4 support
added support for HtmlWebpack Plugin v4's new hooks

# 1.0.0 Initial Releas
Verified that the plugin works with webpack 4 and html-webpack-plugin v3.2
