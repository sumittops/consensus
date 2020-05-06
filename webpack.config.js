const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const dotenv = require('dotenv');
const fs = require('fs');

const envConfigs = dotenv.config({
    path: __dirname + '/.env'
});

module.exports = {
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: "html-loader"
                    }
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'src/index.html',
            filename: 'index.html'
        }),
        new webpack.DefinePlugin({
            "process.env.GRAPHQL_HOST": envConfigs.parsed.GRAPHQL_HOST,
            "process.env.GRAPHQL_WS_HOST": envConfigs.parsed.GRAPHQL_WS_HOST
        })
    ],
    output: {
        publicPath: '/'
    },
    devServer: {
        historyApiFallback: true,
        https: {
            key: fs.readFileSync('./certs/consensus.app+1-key.pem'),
            cert: fs.readFileSync('./certs/consensus.app+1.pem'),
            port: fs.readFileSync('/Users/sumitmajumdar/Library/Application Support/mkcert/rootCA.pem')
        },
        host: 'consensus.app',
        port: 9000
    }
}