import Axios from 'axios';

Axios.defaults.headers['x-forwarded-for'] = '127.0.0.1';
Axios.defaults.withCredentials = true;// 支持跨域带cookie

export default Axios;