import * as utils from './utils';
import config from './config'
const isProduction = process.env.NODE_ENV === 'production'

export default {
    rules: utils.cssLoaders({
        sourceMap: isProduction
            ? config.build.productionSourceMap
            : config.dev.cssSourceMap,
        extract: isProduction
    })
}
