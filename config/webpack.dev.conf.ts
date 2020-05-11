import * as webpack from 'webpack'
import * as merge from 'webpack-merge'
import * as FriendlyErrorsPlugin from 'friendly-errors-webpack-plugin'
import BaseWebpackConfig from './webpack.base.conf'
import * as utils from './utils'
import config from './config'

const baseWebpackConfig = new BaseWebpackConfig('development');

export default merge(baseWebpackConfig, {
    mode: "development",
    output: {
        filename: '[name].js',
        chunkFilename: '[name].js'
    },
    module: {
        rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap })
    },
    devtool: 'cheap-module-eval-source-map',
    plugins: [
        new webpack.DefinePlugin({
            'process.env': config.dev.env
        }),
        new webpack.HotModuleReplacementPlugin(),
        new FriendlyErrorsPlugin()
    ],
    performance: {
        hints: false
    }
})
