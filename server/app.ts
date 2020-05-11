import * as createError from 'http-errors';
import * as express from 'express';
import * as path from 'path';
import * as compression from 'compression';
import * as helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import * as swig from 'swig';
import * as proxy from 'http-proxy-middleware';
import * as cookie from 'cookie';
import Axios from './utils/Axios';
import logger from './log/index';
import router from './routes/router';
import { md5_url } from './class/Filter'
import { parseUA } from "./class/UA"
import { baseUrl } from './class/Util'

const app = express();

const apiProxy = proxy('/api', { target: baseUrl,changeOrigin: true });
app.use('/api/*', apiProxy);
app.use(helmet()); //安全策略
app.use(compression()); //gzip压缩

logger.useLogger(app, 'name');
swig.setFilter('md5_url', md5_url);

// view engine setup
app.set('views', path.join(path.resolve("."), 'server/html'));
app.engine('html', swig.renderFile);
app.set('view engine', 'html');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('node-client'));
app.use(express.static(path.join(__dirname, '../static'), {
    maxAge: '30d'
}));

//set default
app.use((req, res, next) => {
    let ua = parseUA(req.headers['user-agent']);
    let cookies = req.headers.cookie;
    req.cookies = cookie.parse(cookies || '');
    Axios.defaults.headers['x-forwarded-for'] = req.headers['http_x_forwarded_for'] || '127.0.0.1';
    let _ua = req.query.ua;
    if (_ua) {
        res.cookie('ua', _ua);
    }
    let is_wap = ua.is_wap || _ua == 'mobile';
    res.locals.is_app = ua.is_app;
    res.locals.is_wechat = ua.is_wechat;
    res.locals.is_wap = is_wap;
    res.locals.app_version = ua.app_version;
    res.locals.is_android = ua.is_android;
    res.locals.is_browser = is_wap && !ua.is_app && !ua.is_wechat;
    res.locals.app_build = ua.app_build;
    res.locals.render_file = ua.is_wap ? 'views_mobile/' : 'views/';
    res.locals.base_url = baseUrl;
    res.locals.HtmlConfig = {
        title: "***",
        description: "***",
        keywords: "***"
    };
});

app.use('/', router);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

//error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status);
    res.render(res.locals.render_file + 'error/404');
});

export default app;
