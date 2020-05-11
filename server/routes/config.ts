export function renderError(req, res, err) {
    let message:string;
    //取第一个报错接口信息展示
    message = typeof err == 'object' ? err.message || 404 : err || '404';
    res.render(res.locals.render_file+'error/default', {
        message: message
    });   
}

export function render404(req, res, err) {
    res.render(res.locals.render_file+'error/404');   
}

export function rsyncCookie(req, res) {
    if (!req.cookies) return;
    for(let attr in req.cookies) {
        res.cookie(attr, req.cookies[attr]);
    }
}