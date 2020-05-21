const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const dotenv = require('dotenv');
const fs = require('fs');

dotenv.config({
    path: __dirname + '/.env'
});

const httpsConfigExists = process.env.SSL_KEY_PATH && process.env.SSL_CERT_PATH;

module.exports = {
    entry: './src/index.js',
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
            "process.env.GRAPHQL_HOST": process.env.GRAPHQL_HOST,
            "process.env.GRAPHQL_WS_HOST": process.env.GRAPHQL_WS_HOST
        })
    ],
    output: {
        publicPath: '/'
    },
    devServer: {
        historyApiFallback: true,
        https: httpsConfigExists ? {
            key: fs.readFileSync(process.env.SSL_KEY_PATH),
            cert: fs.readFileSync(process.env.SSL_CERT_PATH),
        } : false,
        host: httpsConfigExists ? 'consensus.app' : '0.0.0.0',
        port: 9000
    }
}