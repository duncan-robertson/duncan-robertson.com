const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ScriptExtPlugin = require('script-ext-html-webpack-plugin');
const { CleanWebpackPlugin} = require('clean-webpack-plugin');
const { AngularWebpackPlugin } = require('@ngtools/webpack');

module.exports = {
    entry: './src/main.ts',
    output: {
        path: __dirname + '/dist',
        filename: '[name].[hash].js'
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: '@ngtools/webpack'
            },
            { 
                test: /app[\\\/].*\.html$/,
                type: 'asset/source'
            },
            {
                test: /app[\\\/].*\.css$/,
                type: 'asset/source'
            },
            {
                test: /app[\\\/].*\.s[ac]ss$/,
                loader: 'sass-loader',
                type: 'asset/source'
            }
        ]
    },
    optimization: {
        runtimeChunk: 'single',
        splitChunks: {
            chunks: 'all',
            maxInitialRequests: Infinity,
            minSize: 0,
            cacheGroups: {
                vendor: {
                    test: /[\\\/]node_modules[\\\/]/,
                    name: 'vendor'
                }
            }
        }
    },
    plugins: [
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns: [
                { from: 'src/assets', to: 'assets' }
            ]
        }),
        new HtmlWebpackPlugin({
            template: 'raw-loader!' +__dirname + '/src/index.html',
            output: __dirname + '/dist',
            inject: 'head'
        }),
        new ScriptExtPlugin({
            defaultAttribute: 'defer'
        }),
        new AngularWebpackPlugin({
            tsconfig: './tsconfig.json'
        })
    ]
};