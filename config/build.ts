import * as webpack from 'webpack';
import * as ora from 'ora';
import webpackConfig from './webpack.prod.conf';
import * as chalk from 'chalk'

const platform = process.env.PLATFORM ? process.env.PLATFORM : 'wap';

const spinner = ora('Building for production...' + 'Platform is ' + platform)
spinner.start()

webpack(webpackConfig, function (err: any, stats: any) {
    spinner.stop()
    if (err) throw err
    process.stdout.write(stats.toString({
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false
    }) + '\n\n')

    console.log((<any>chalk).cyan('  Build complete.\n'))
    console.log((<any>chalk).yellow(
        '  Tip: Please commit all files in the dist folder.\n' +
        '  Happy Hacking.\n'
    ))
})
