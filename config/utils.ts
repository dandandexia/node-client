
import * as path from 'path';
import * as ExtractTextPlugin from 'extract-text-webpack-plugin';

const config = require('./config');
export function assetsPath(_path: string) {
    const assetsSubDirectory = process.env.NODE_ENV === 'production'
        ? config.build.assetsSubDirectory
        : config.dev.assetsSubDirectory
    return path.posix.join(assetsSubDirectory, _path)
}
interface CssOption {
    minimize?: boolean;
    sourceMap?: boolean;
    extract?: any;
    indentedSyntax?: boolean;
}
export function cssLoaders(options: CssOption) {
    const cssLoader = {
        loader: 'css-loader',
        options: {
            minimize: process.env.NODE_ENV === 'production',
            sourceMap: options.sourceMap
        }
    }
    // generate loader string to be used with extract text plugin
    function generateLoaders(loader?:string, loaderOptions?:CssOption) {
        let loaders:any[] = [cssLoader];
        // Ues postcss handle style files outside of .vue

        loaders.push({
            loader: 'postcss-loader',
            options: {
                sourceMap: true
            }
        })
        if (loader) {
            loaders.push({
                loader: loader + '-loader',
                options: Object.assign({}, loaderOptions, {
                    sourceMap: options.sourceMap
                })
            })
        }

        // Extract CSS when that option is specified
        // (which is the case during production build)
        if (options.extract) {
            return ExtractTextPlugin.extract({
                use: loaders,
                fallback: 'vue-style-loader'
            })
        } else {
            return ['vue-style-loader'].concat(loaders)
        }
    }

    // http://vuejs.github.io/vue-loader/en/configurations/extract-css.html
    return {
        css: generateLoaders(),
        postcss: generateLoaders(),
        // less: generateLoaders('less'),
        sass: generateLoaders('sass', { indentedSyntax: true }),
        scss: generateLoaders('sass'),
        // stylus: generateLoaders('stylus'),
        // styl: generateLoaders('stylus')
    }
}
interface Loader{
    [index:string]: Array<string | object>
}
export function styleLoaders(options:CssOption) {
    let output = []
    let loaders:Loader = cssLoaders(options)
    for (let extension in loaders) {
        const loader = loaders[extension]
        output.push({
            test: new RegExp('\\.' + extension + '$'),
            loader: loader,
        })
    }
    return output
}
