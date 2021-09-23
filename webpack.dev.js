const webpack = require('webpack');
const {mergeWithRules} = require('webpack-merge');
const common = require('./webpack.common');
var definitions = require('./webpack.definitions');

module.exports = mergeWithRules({
    plugins: "append"
}
)(common, {
    mode: 'development',
    devtool: 'eval-cheap-module-source-map',
    plugins: [
        new webpack.DefinePlugin(definitions)
    ]
});