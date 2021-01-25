const path = require('path')
const htmlWebpackPlugins = require('html-webpack-plugin')
const vconsolePlugin = require('./vconsole.plugin')
var vConsolePlugin = require('vconsole-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
    entry: ['./src/index'],
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].[chunkhash].js'
    },
    module: {
        rules: [
            {
                test: /\.md$/,
                use: [
                    'html-loader',
                    {
                        loader: require.resolve('./markdown.plugin.js'),
                        options: {
                            simplifiedAutoLink: true,
                            tables: true
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new htmlWebpackPlugins(),
        new vconsolePlugin({
            enable: false
        }),
    ]
}