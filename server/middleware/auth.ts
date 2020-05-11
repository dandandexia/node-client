import Xhr from '../utils/Xhr';
import { base_url, getCookie } from '../class/Util';
import { renderError } from '../routes/config'

export function authUser(req , res, next) {
    Xhr.get(`${base_url()}api/uc/check_user_login`, {}, {headers:{Cookie: req.headers.cookie || ''}})
        .then(res1=>{
            if (!res1.data.is_login) {
                res.redirect(`${base_url()}login?jump=${base_url()}${req.originalUrl.substr(1)}`);
                return;
            }
            res.cookie('IS_LOGIN', getCookie(req.headers.cookie.split(';'), 'IS_LOGIN'));
            next();
        })
        .catch(err=> {
            renderError(req, res, err);
        })
}