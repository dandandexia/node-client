import * as path from 'path'
import entryWap from './entry/wap'
import entryPc from './entry/pc'
import { Configuration } from 'webpack'
import config from './config'
import vueLoaderConfig from './vue-loader.conf'
import HashedModuleIdsPlugin from './HashedModuleIdsPlugin'

const VueLoaderPlugin = require('vue-loader/lib/plugin')
const platform = process.env.PLATFORM ? process.env.PLATFORM : 'wap'
const entryJson: object = platform == "wap" ? entryWap : entryPc

interface PathConfig {
    [index: string]: string
}

const resolve = (dir:string) => {
  return path.join(__dirname, '..', dir)
}

const outputPath: PathConfig = {
    'wap': path.resolve(__dirname, '../static/dist/wap'),
    'pc': path.resolve(__dirname, '../static/dist/pc')
}

export default class BaseWabpackConfig implements Configuration {
    mode: Configuration['mode'] = 'production';
    target: Configuration['target'] = 'web';
    entry = (<any>Object).assign({}, entryJson);
    output = {
        path: outputPath[platform] + '/js/',
        filename: '[name].js',
        chunkFilename: '[name].js',
        publicPath: (<any>config.build).publicPath[platform]
    };
    module = Object.assign(vueLoaderConfig, {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    scss: 'vue-style-loader!css-loader!sass-loader',
                    sass: 'vue-style-loader!css-loader!sass-loader?indentedSyntax',

                }
            },
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: [
                    'babel-loader',
                    {
                        loader: 'ts-loader',
                        options: {
                            appendTsSuffixTo: [/\.vue$/],
                            // 加快编译速度
                            transpileOnly: true,
                            // 指定特定的ts编译配置，为了区分脚本的ts配置
                            configFile: path.resolve(__dirname, './tsconfig.json')
                        }
                    }

                ]
                
            }
        ]
    });
    optimization = (<any>Object).assign({}, {
        splitChunks: {
            minChunks: 3,
            cacheGroups: {
                vendor: {
                    name: 'vendor',
                    chunks: 'initial',
                    priority: -10,
                    reuseExistingChunk: false,
                    // test: (module:any, chunk:any)=>{
                    //     console.log('############\n');
                    //     console.log(module);
                    // }
                    test: /node_modules\/(.*)\.js/
                },
            }
        },
        runtimeChunk: {
            name: 'manifest'
        }
    });
    resolve = {
        extensions: ['.ts', '.js', '.vue', '.json',  '.tsx'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            'common': resolve('common'),
            '@': resolve('fe/src'),
            'src': resolve('fe/src'),
            'wap': resolve('fe/src/wap'),
            'pc': resolve('fe/src/pc')
        }
    };
    plugins = [
        new HashedModuleIdsPlugin(),
        new VueLoaderPlugin()
        // We don't need manifest file since we don't use webpack's chunkhash.
        // new webpack.optimize.RuntimeChunkPlugin({
        //     name: 'manifest',
        //     chunks: ['vendor']
        // }),
    ];
    constructor(mode: Configuration['mode']) {
        this.mode = mode;
    }
}
