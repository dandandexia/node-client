const log4js = require('log4js');
const log_dir = '/data/applogs/broker-node'

log4js.configure({
    replaceConsole: true,
    appenders: {
        stdout: {//控制台输出
            type: 'stdout'
        },
        req: {//请求
            type: 'dateFile',
            filename: `${log_dir}/reqlog/`,
            pattern: 'req-yyyy-MM-dd.log',
            maxLogSize: 1024*1024*10,
            alwaysIncludePattern: true
        },
        err: {//错误日志
            type: 'dateFile',
            filename: `${log_dir}/errlog/`,
            maxLogSize: 1024*1024*10,
            pattern: 'err-yyyy-MM-dd.log',
            alwaysIncludePattern: true
        },
        oth: {//其他日志
            type: 'dateFile',
            maxLogSize: 1024*1024*10,
            filename: `${log_dir}/othlog/`,
            pattern: 'oth-yyyy-MM-dd.log',
            alwaysIncludePattern: true
        }
    },
    categories: {
        default: { appenders: ['stdout', 'req'], level: 'debug' },//appenders:采用的appender,取appenders项,level:设置级别
        err: { appenders: ['stdout', 'err'], level: 'error' },
        oth: { appenders: ['stdout', 'oth'], level: 'info' }
    },
    disableClustering: true
})
export { log4js }
