interface decodeFunc {
    (str: string): string
}

interface parseOptions {
    maxKeys?: number;
    decodeURIComponent: decodeFunc,
    [string: string]: any
}

export function escape(str) {
    return encodeURIComponent(str);
};

export function parse(str, sep?, eq?, options?) {
    let keys = 0, set: Array<any> = [], result = Object.create(null), key, value;
    let default_options: parseOptions = {
        maxKeys: 1000,
        decodeURIComponent: unescape
    };
    str = String(str);
    sep = sep || '&';
    eq = eq || "=";
    options = Object.assign(default_options, options);
    set = str.split(sep);
    for (var i = 0; i < set.length; i++) {
        [key, value] = set[i].split(eq);
        value = options.decodeURIComponent(value);
        if (result[key]) {
            result[key] = [value].concat(result[key]);
        } else {
            keys++;
            result[key] = value;
        }
        if (keys == options.maxKeys) break;
    }
    return result;
}

interface stringifyOptions {
    encodeURIComponent: decodeFunc,
    [string: string]: any
}
export function stringify(obj, sep?, eq?, options?) {
    let set = [], result = "", key, value;
    let default_options: stringifyOptions = {
        encodeURIComponent: escape
    }
    obj = Object(obj);
    sep = sep || '&';
    eq = eq || "=";
    options = Object.assign(default_options, options);
    return Object.keys(obj).map(key => {
        if (Array.isArray(obj[key])) {
            return obj[key].map(value => {
                return key + eq + options.encodeURIComponent(value);
            }).join(sep)
        } else if (typeof obj[key] == 'object') {
            let obj1 = Object(obj[key]);
            let str = key;
            return Object.keys(obj1).map(key => {
                return str + '[' + key + ']' + eq + options.encodeURIComponent(obj1[key]);
            }).join(sep);
        } else {
            return key + eq + options.encodeURIComponent(obj[key]);
        }
    }).join(sep);
}

export function unescape(str) {
    return decodeURIComponent(str);
}

