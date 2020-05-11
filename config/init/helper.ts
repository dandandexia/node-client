    
export function checkRouterName(name:string) {
    return /^(\/)?([a-zA-Z0-9\_\-]\/?)+$/.test(name)
}
export function handerRouterName(name:string){
    const nameString = name.replace(/^(\/)?/, '').replace(/(\/)?$/, '')
    return nameString.split('/')
}
export function  routerToView(prefix:string, name:string){
    // test => /test/index.tpl.php test_index
    // test/a => /test/a.tpl.php test_a
    // test/b/a => /test/b/a.tpl.php test_b_a
    // test/b/a/c/ => /test/b/a/c.tpl.php test_b_c
    const path = this.handerRouterName(name)
    const length = path.length
    if (length === 1) {
        return prefix + '/' + path[0] + '/index.html'
    } else {
        return prefix + '/' + path.slice(0, length - 1).join('/') + '/' + path[length - 1] + '.html'
    }
}
export function routerToEntryName(name:string){
    const path = this.handerRouterName(name)
    const length = path.length
    if (length === 1) {
        return path[0] + '_index'
    } else {
        return path.join('_')
    }
}
export function routerToEntryUrl(prefix:string, name:string, postfix:string){
    const path = this.handerRouterName(name)
    return prefix + '/' + path.join('/') + '/' + postfix
}
export function promiseAll(list:any){
    if (Array.isArray(list)) {
        const todo = list.map((item) => {
            return item
        })
        return Promise.all(todo)
    } else {
        return list
    }
}

