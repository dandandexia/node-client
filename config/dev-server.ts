import * as webpack from 'webpack';
import * as fs from 'fs';
import * as path from 'path';
import webpackConfig from './webpack.dev.conf';
import config from './config'
import mockJson from './mock'
const minimist = require('minimist');
const args = minimist(process.argv);

const webpackDevMiddleware = require('webpack-dev-middleware');
const browserSync = require('browser-sync').create()
const platform = process.env.PLATFORM ? process.env.PLATFORM : 'wap';
const dir_name = platform == 'wap' ? 'views_mobile' : 'views';
process.env.NODE_ENV = 'development';

// browserSync will watch and auto reload/injected those files,
// and they will NOT be handled by webpack.
const watchFilesList = [
    'server/html',
    'static/css/**/*.css',
    'static/js/**/*.js',
]

const promise = function () {
    return new Promise((resolve, reject)=>{
        //清空版本号
        fs.writeFile(path.resolve(__dirname, '../server/html/', dir_name,  './_version.html'), '', 'utf-8', (err)=>{
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    })
}
interface Mock {
    [index:string]: string
}
// webpack
const compiler = webpack(webpackConfig)

// handle Errors
compiler.plugin('done', (stats) => {
    if (stats.hasErrors() || stats.hasWarnings()) {
        return browserSync.sockets.emit('fullscreen:message', {
            title: 'Webpack Error:',
            body: stats.toString(),
            timeout: 100000
        })
    }
    browserSync.reload();
    
})
promise()
    .then(()=>{
        // browserSync https://browsersync.io/
        browserSync.init({
            port: '3100',
            proxy: '127.0.0.1:3000',
            open: config.dev.openInBrowser,
            notify: false,
            injectChanges: true,
            browser: ['google chrome'],
            logFileChanges: true,
            logPrefix: 'Broker_' + platform,
            middleware: [
                webpackDevMiddleware(compiler, {
                    publicPath: (<any>webpackConfig.output).publicPath,
                    stats: {
                        colors: true
                    }
                }),
                {
                    route: '/api',
                    handle: function (req:any, res:any, next:any) {
                      // console.log(args, typeof args, args.m);
                        try {
                            if ((args).m) {
                                let url = req.url;
                                let match_url = '';
                                for (let attr in mockJson) {
                                    if (url.indexOf(attr) >= 0) {
                                    match_url = attr;
                                    }
                                }
                                fs.readFile(path.resolve(__dirname, (<Mock>mockJson)[match_url]), 'utf8', (err, data) => {
                                    res.write(data);
                                    res.end();
                                })
                            } else {
                                next();
                            }
                        } catch(e) {
                            next();
                        }
                    }
                }
            ],
            plugins: ['bs-fullscreen-message'],
            files: watchFilesList,
            snippetOptions: {
                rule: {
                    match: /<\/body>/i,
                    fn: (snippet: any, match: any) => {
                        return snippet + afterLoaded + match
                    }
                }
            }
        });

        console.log('Staring dev server...' + 'Platform is ' + platform)
    })

// During the development, Webpack will inject all css into the HTML, 
// which conflict with our setting in the HTML header, so we removed it in development.
const afterLoaded = '<script>(function(){var bcss = document.getElementById(\'build_css\');bcss ? bcss.parentNode.removeChild(bcss):\'\'})();</script>'



