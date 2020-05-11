/**
 * 阿里oss图片上传，用于cdn文件上传，如有其他使用请补充
 * 此文件谨慎修改
 */

import * as OSS from 'ali-oss'

const client = new OSS({
    endpoint: '',
    accessKeyId: '',
    accessKeySecret: '',
    bucket: ''
});

// 同步上传
export async function AwaitUpload({name, path, count = 1, onSuccess = () => {}, onFail = () => {}}) {
    try {
        const r1 = await client.put(name, path); 
        // console.log('upload success: %j', r1);
        onSuccess();
    } catch(err) {
        const newtimes = count + 1;
        // 上传失败则自动重新上传，最多可上传三次
        if (count < 3) {
            AwaitUpload({name, path, count: newtimes})
        } else {
            // 3次上传均失败之后执行fail函数
            onFail();
        }
        // console.error('error: %j', err);
    }
}

// 异步上传
export function AsyncUpload({name, path, count = 1, onSuccess = () => {}, onFail = () => {}}) {
    return new Promise((resolve, reject)=>{
        client.put(name, path).then((r1) => {
            // 上传成功回调
            onSuccess();
            // console.log('upload success: %j', r1);
            resolve(r1);
        }).catch((err) => {
            const newtimes = count + 1;
            // 上传失败则自动重新上传，最多可上传三次
            if (count < 3) {
                AsyncUpload({name, path, count: newtimes})
            } else {
                // 3次上传均失败之后执行fail函数
                onFail();
            }
            reject();
            console.error('error: %j', err);
        });
    })
}