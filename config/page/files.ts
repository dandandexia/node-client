import * as fs from 'fs';
import * as mkdirp from 'mkdirp'
import * as path from 'path'
const dirname = path.dirname


export function mkdir(dir: string, o: object) {
    return new Promise((resolve, reject) => {
        mkdirp(dir, o, (err:any) => {
          if (err) return reject(err)
          resolve()
        })
      })
}

export function writeFile(path:string, data:any, o?: object): any {
    return new Promise(function (resolve, reject) {
        fs.writeFile(path, data, (err) => {
            if (err) { 
                reject(err)
            } else {
                resolve(path)
            }
            })
        })
        .catch((err: any) => {
            if (err.code !== 'ENOENT'){
                throw err;
            }
            return mkdir(dirname(path), {})
            .then(() => {
                return writeFile(path, data, o)
            })
        })
}

export function checkFileExists(path:string) {
    return new Promise((resolve, reject) => {
        fs.access(path, fs.constants.F_OK, (err) => {
          if (!err) {
            reject(path)
          } else {
            resolve()
          }
        })
      })
}
