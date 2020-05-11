declare module "*.vue" {
    import Vue from "vue";
    export default Vue;
}

declare module '*.scss';

declare module 'react-lazy-load';

interface PageInfo {
    [index:string]: any
}

interface PageConfig {
    is_wechat: boolean;
    is_app: boolean;
    is_wap: boolean;
}

declare interface Window {
    JSEncrypt: any,
    PAGEINFO: PageInfo,
    CONFIG: PageInfo,
    IScroll: any,
}