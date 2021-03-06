import * as path from 'path';
import * as StartServerPlugin from "start-server-webpack-plugin";
import * as webpack from 'webpack';
import * as nodeExternals from 'webpack-node-externals';
import {Configuration, ExternalsElement} from 'webpack';

class WebpackConfig implements Configuration {
    // node环境
    target: Configuration['target'] = "node";
    // 默认为发布环境
    mode: Configuration['mode'] = 'production';
    // 入口文件
    entry = [path.resolve(__dirname, '../server/server.ts'), "webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true"];
    output = {
        publicPath: "/dist/",
        path: path.resolve(__dirname, '../dist'),
        filename: 'server.js',
    };
    // 这里为开发环境留空
    externals: ExternalsElement[] = [];
    // loader们
    module = {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    // tsc编译后，再用babel处理
                    {loader: 'babel-loader',},
                    {
                        loader: 'ts-loader',
                        options: {
                            // 加快编译速度
                            transpileOnly: true,
                            // 指定特定的ts编译配置，为了区分脚本的ts配置
                            configFile: path.resolve(__dirname, './tsconfig.json')
                        }
                    }
                ],
                exclude: /node_modules/
            },
            {
                test: /\.jsx?$/,
                use: 'babel-loader',
                exclude: /node_modules/
            }
        ]
    };
    resolve = {
        extensions: [".ts", ".js", ".json"],
    };
    // 开发环境也使用NoEmitOnErrorsPlugin
    plugins = [new webpack.NoEmitOnErrorsPlugin()];
    constructor(mode: Configuration['mode']) {
        // 配置mode，production情况下用上边的默认配置就ok了。
        this.mode = mode;
        if (mode === 'development') {
            // 添加webpack/hot/signal,用来热更新
            this.entry.push('webpack/hot/signal');
            this.externals.push(
                // 添加webpack/hot/signal,用来热更新
                nodeExternals({
                    whitelist: ['webpack/hot/signal']
                })
            );
            const devPlugins = [
                // 用来热更新
                new webpack.HotModuleReplacementPlugin(),
                // // 启动服务
                // new StartServerPlugin({
                //     // 启动的文件
                //     name: 'server.js',
                //     // 开启signal模式的热加载
                //     signal: true,
                //     // 为调试留接口
                //     nodeArgs: ['--inspect']
                // }),
            ]
            this.plugins.push(...devPlugins);
        }
    }
}

export default WebpackConfig;