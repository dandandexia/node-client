
export default {
    dev: {
        env: {
            NODE_ENV: JSON.stringify('development')
        },
        port: {
            wap: 3100,
            pc: 3100,
        },
        openInBrowser: false,
        cssSourceMap: false,
    },
    build: {
        env: {
            NODE_ENV: JSON.stringify('production')
        },
        publicPath: {
            wap: '/dist/wap/js/',
            pc: '/dist/pc/js/'
        },
        productionSourceMap: false,
        bundleAnalyzerReport: false
    }
}