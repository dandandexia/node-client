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