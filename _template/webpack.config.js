require('babel-polyfill'); // nodejs 0.10 fallback

const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');
const autoprefixer = require('autoprefixer');
const assetsDir = path.join(__dirname, 'src');
const isProduction = !!process.env.NODE_ENV;

let loaderRules = [
    {
        test: /\.woff2?(\?v=[\d\.]+)?$/,
        use: 'url-loader?limit=1024&minetype=application/font-woff'
    },
    {
        test: /\.(ttf|eot|svg)(\?v=[\d\.]+)?$/,
        use: 'file-loader'
    },
    {
        test: /\.(png|jpg|gif)$/,
        use: 'url-loader?limit=1024'
    },
    {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: {
                loader: 'css-loader',
                options: { sourceMap: !isProduction }
            }
        }),
    },
    {
        test: /\.less$/,
        use: ExtractTextPlugin.extract([{
            loader: 'css-loader',
            options: { sourceMap: !isProduction }
        }, {
            loader: 'less-loader',
            options: { sourceMap: !isProduction }
        }]),
    },
    {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract([
            {
                loader: 'css-loader',
                options: { sourceMap: !isProduction }
            },
            {
                loader: 'postcss-loader',
                options: {
                    sourceMap: true,
                    plugins: () => {
                    return [
                        autoprefixer({browsers: ['> 1%', 'ie 8', 'ie 9']})
                    ]
                }
            }
    },
    {
        loader: 'sass-loader',
        options: { sourceMap: !isProduction }
    }])
},
{
    test: /\.js$/,
        use: 'babel-loader',
    exclude: /node_modules|bower_components/,
},
{
    test: /\.vue$/,
        use: 'vue-loader'
}
];

let defaultConfig = {
    devtool: 'source-map',

    entry: {
        webStyles: [
            path.join(assetsDir, '/sass/app.scss')
        ],

        webScripts: [
            path.join(assetsDir, '/js/app.js')
        ]
    },

    output: {
        publicPath: '',
        filename: '[name].js',
        path: path.join(__dirname, '/dist/')
    },

    resolve: {
        descriptionFiles: ["package.json"],
        modules: [
            path.join(__dirname, 'node_modules')
        ],
        alias: {
            "jquery": "jquery-1/dist/jquery.js",
            'vue$': 'vue/dist/vue.common.js'
        }
    },

    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
        }),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery"

        }),
        new ExtractTextPlugin('[name].css'),
        new WebpackNotifierPlugin(),
        new webpack.NoErrorsPlugin()
    ],

    module: {
        rules: loaderRules
    }
};



module.exports = [
    defaultConfig
];
