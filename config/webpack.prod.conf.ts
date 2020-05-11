import * as webpack from 'webpack';
import * as merge from 'webpack-merge';
// import * as path from 'path';
import * as OptimizeCSSPlugin from 'optimize-css-assets-webpack-plugin';
import * as ExtractTextPlugin from 'extract-text-webpack-plugin';
// import * as AssetsPlugin from 'assets-webpack-plugin';
import * as UglifyJsPlugin from 'uglifyjs-webpack-plugin';
import * as utils from './utils';
import BaseWebpackConfig from './webpack.base.conf';
import config from './config'

const baseWebpackConfig = new BaseWebpackConfig('production');

export default merge(baseWebpackConfig, {
    mode: 'production',
    module: {
        rules: utils.styleLoaders({
            sourceMap: config.build.productionSourceMap,
            extract: true
        }),
    },
    devtool: config.build.productionSourceMap ? '#source-map' : false,
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                sourceMap: true,
                uglifyOptions: {
                    compress: false
                }
            })
        ]
    },
    plugins: [
        // http://vuejs.github.io/vue-loader/en/workflow/production.html
        new webpack.DefinePlugin({
            'process.env': config.build.env
        }),
        // extract css into its own file
        new ExtractTextPlugin({
            filename: '../css/[name].css',
            allChunks: true
        }),
        // Compress extracted CSS. We are using this plugin so that possible
        // duplicated CSS from different components can be deduped.
        new OptimizeCSSPlugin(),
    ],
    performance: {
        hints: false
    }
})

//可视化资源分析工具
// if (config.build.bundleAnalyzerReport) {
//   const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
//   webpackConfig.plugins.push(new BundleAnalyzerPlugin())
// }

