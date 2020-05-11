
let allow_domains = [];

export function base_url():string {
    if (process.env.NODE_ENV == 'development') {
        return 'http://dev.qingsongjob.work/'
    } else {
        return 'http://qingsongjob.work/'
    }
}

export const baseUrl = process.env.NODE_ENV === 'development' ? 'http://dev.qingsongjob.work/' : 'http://qingsongjob.work/';

export function is_allow_domin(domin:string):boolean {
    return allow_domains.indexOf(domin) >= 0;
}

//针对set-cookie
export function getCookie(cookie: Array<string>, name: string): string {
    let Cookies = {};
    cookie && cookie.length && cookie.forEach(Cookie => {
        Cookie && Cookie.split(';').forEach(value=>{
            let parts = value.split('=');
            Cookies[ parts[ 0 ].trim() ] = ( parts[ 1 ] || '' ).trim();
        })
    });
    return Cookies[name];
}