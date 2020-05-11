import { log4js } from './config';
import sendMail from './email'

class Logger{
    error(str: any) {
        log4js.getLogger('err').error(str);
        if (process.env.NODE_ENV == 'production') {
            sendMail(str);
        }
    }

    debug(str: string) {
        log4js.getLogger('debug').debug(str);
    }

    info(str:string) {
        log4js.getLogger('info').info(str);
    }

    warn(str:string) {
        log4js.getLogger('warn').warn(str);
    }

    useLogger(app: any, name: string) {
        app.use(log4js.connectLogger(log4js.getLogger(name||'default'), {
            format: '[:remote-addr :method :url :status :response-timems][:referrer HTTP/:http-version :user-agent]'//自定义输出格式
        }))
    }

}

export default new Logger();