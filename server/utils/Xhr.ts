import Axios from './Axios';
import * as QS from '../../common/QueryString';
import logger from '../log/index';

export default {
    post(url, params, options?) {
        logger.info(`post ${url}：`+JSON.stringify(params));
        return Axios.post(url, QS.stringify(params))
            .then(res=>{
                if (res.data.code == 1) {
                    return Promise.resolve(res.data);
                } else {
                    return Promise.reject(res.data);
                }
            })
            .catch(reason=>{
                logger.error(reason);
                return Promise.reject(reason);
            })
    },
    get(url, params?, options?) {
        logger.info(`get ${url}：`+JSON.stringify(params));
        return Axios.get(url, Object.assign({params: params}, options))
                .then(res=>{
                    if (res.data.code == 1) {
                        return Promise.resolve(res.data);
                    } else {
                        return Promise.reject(res.data);
                    }
                })
                .catch(reason=>{
                    logger.error(reason);
                    return Promise.reject(reason);
                })
    }
}