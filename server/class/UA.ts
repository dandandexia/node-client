
function matchWap(ua:string) {
    return /android|iphone|MicroMessenger|ipod|gg-app-ios|gg-app-android/ig.test(ua);
}

function matchiPhone(ua:string): boolean {
    return /iPhone/i.test(ua);
}

function matchAndroid(ua:string) :boolean {
    return /Android/i.test(ua);
}

function matchApp(ua:string) :boolean {
    return /gg-app-ios/ig.test(ua) || /gg-app-android/ig.test(ua);
}

function matchWechat(ua:string): boolean {
    return /MicroMessenger/i.test(ua);
}

function getAppVersion(ua: string, isApp: boolean) :string {
    return isApp ? ua.split('_')[7] || "" : "";
}

function getAppBuild(ua:string, isApp: boolean) :number {
    return isApp ? +ua.split('_')[8] || 0 : 0;
}

export function parseUA(ua) {
    const isApp = matchApp(ua);
    const is_iphone = matchiPhone(ua);
    const iOSVersion = is_iphone && isApp ? parseInt(ua.split('_')[3], 10) : 0;
    return {
        is_wap: matchWap(ua),
        is_app: isApp,
        is_wechat: matchWechat(ua),
        is_android: matchAndroid(ua),
        is_iphone: matchiPhone(ua),
        ios_version: iOSVersion,
        app_version: getAppVersion(ua, isApp),
        app_build: getAppBuild(ua, isApp)
    }
}

export function test() {

}