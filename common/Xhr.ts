import Axios from 'axios';
import * as QS from './QueryString';
export default {
    post(url, params) {
        return Axios.post(url, QS.stringify(params))
            .then(res=>{
                if (res.data.code == 1) {
                    return Promise.resolve(res.data);
                } else {
                    return Promise.reject(res.data);
                }
            })
            .catch(reason=>{
                return Promise.reject(reason);
            })
    },
    get(url, params?) {
        return Axios.get(url, {params: params})
                .then(res=>{
                    if (res.data.code == 1) {
                        return Promise.resolve(res.data);
                    } else {
                        return Promise.reject(res.data);
                    }
                })
                .catch(reason=>{
                    return Promise.reject(reason);
                })
        
    }
}