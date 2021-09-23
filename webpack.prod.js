const {mergeWithRules} = require('webpack-merge');
const webpack = require('webpack');

var common = require('./webpack.common');
var definitions = require('./webpack.definitions');
Object.assign(definitions, {
    PRODUCTION: true
});

module.exports = mergeWithRules({
    plugins: "append"
}
)(common, {
    mode: 'production',
    plugins: [
        new webpack.DefinePlugin(definitions)
    ]
});