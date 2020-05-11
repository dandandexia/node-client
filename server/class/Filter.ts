//swigjs template filter 
const assets_json = require('../assets_md5.json');

export function md5_url(url:string):string {
    if (process.env.NODE_ENV == 'production') {
        return `//**.com/prd${assets_json[url]}`;
    } else {
        return url+'?_v='+new Date().getTime();
    }
}