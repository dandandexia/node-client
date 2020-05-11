
import * as fs from 'fs';
import * as path from 'path'
import * as crypto from 'crypto'
import { AsyncUpload } from './OssClient'

const assetsJson = require('../assets_md5.json');

const originJson = Object.assign({}, assetsJson);

let SuccessUploadCount = 0;
let FailUploadCount = 0;
const UploadList = [];

function updateJson(data) {
    fs.writeFileSync(path.resolve(__dirname, '../assets_md5.json'), JSON.stringify(data, null, 4), 'utf-8')
}

function dealFile(pathname) {
    try {
        const data = fs.readFileSync(pathname, 'utf-8');
        if (data) {
            const md5 = crypto.createHash('md5');
            const relativePath = `/${path.relative(path.resolve(__dirname, '../../static'), pathname)}`;
            const result = `${path.dirname(relativePath)}/${path.basename(relativePath, path.extname(relativePath))}@${md5.update(String(data), 'utf-8' as any).digest('hex')}${path.extname(relativePath)}`;
            assetsJson[relativePath] = result;
            if (originJson[relativePath] !== result) {
                // 静态文件上传cdn
                UploadList.push(AsyncUpload({
                    name: `/prd${result}`,
                    path: pathname,
                    onSuccess: () => {
                        // 上传成功后更新assets_md5.json
                        updateJson(assetsJson);
                        SuccessUploadCount++;
                    },
                    onFail: () => {
                        FailUploadCount++;
                    }
                }))
                
            }
        }
    } catch (err) {
        console.error(err);
    }
}

function dealDir(files, paths) {
    if (!files.length) return;
    for (let i = 0, len = files.length; i < len; i++ ) {
        const newPath = `${paths}/${files[i]}`;
        try {
            const stats = fs.statSync(newPath);
            if (stats.isDirectory()) {
                try {
                    const subfiles = fs.readdirSync(newPath, 'utf8');
                    dealDir(subfiles.filter(name => name !== '.DS_Store'), newPath);
                } catch(err) {
                    throw err;
                }
            } else {
                dealFile(newPath)
            }
        } catch(err) {
            console.error(err);
        }
    }
}

try {
    const files = fs.readdirSync(path.resolve(__dirname, '../../static'), 'utf8');
    const newFiles = files.filter(name => name === 'dist' || name === 'css'|| name ==='js');
    dealDir(newFiles.filter(name => name !== '.DS_Store'), path.resolve(__dirname, '../../static'));
    Promise.all(UploadList)
        .then(res=>{
            console.log(`本次修改新增静态文件${SuccessUploadCount}个，上传失败${FailUploadCount}个`);
        })
} catch (err) {
    console.log(err);
}



