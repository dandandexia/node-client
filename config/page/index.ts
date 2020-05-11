import * as path from 'path';
// import * as http from 'http';
import * as inquirer from 'inquirer';
import * as files from './files';
import * as helper from './helper';
import * as template from './template';
import wapEntry from '../entry/wap';
import pcEntry from '../entry/pc';

const chalk = require('chalk');
const rootPath = path.resolve(__dirname, '../../');

interface Platform_Config {
    [index: string]: string
}
const viewsPath: Platform_Config = {
    wap: rootPath + '/server/html/views_mobile',
    pc: rootPath + '/server/html/views'
}
const staticPath: Platform_Config = {
    wap: rootPath + '/fe/src/wap',
    pc: rootPath + '/fe/src/pc',
}
const entryPath: Platform_Config = {
    wap: rootPath + '/config/entry/wap.ts',
    pc: rootPath + '/config/entry/pc.ts'
}
const entryWritePath: Platform_Config = {
    wap: './fe/src/wap',
    pc: './fe/src/pc'
}
const platform = process.env.PLATFORM ? process.env.PLATFORM : 'wap'

let result = {} // 用户输入的构建条件最终结果

// 处理要写入的模板，PHP、JS、CSS、VUE
const handleTpl = (router: string, tpl: any) => {
    let list = []
    for (let key in tpl) {
        if (key === 'html') {
            list.push(files.writeFile(
                helper.routerToView(viewsPath[platform], router),
                tpl[key])
            )
        } else if (key === 'ts'){
            list.push(files.writeFile(
                helper.routerToEntryUrl(staticPath[platform], router, 'app.ts'),
                tpl[key])
            )
        } else {
            list.push(files.writeFile(
                helper.routerToEntryUrl(staticPath[platform], router, key.indexOf('/') > 0 ? key :'index.'+key),
                tpl[key])
            )
        }
    }
    return list
}
interface BuidlEntry {
    [index: string]: string
}

// 写入文件和entry
const build = (config: any) => {
    const router = config.router_name
    const pageName = helper.routerToEntryName(router);
    // 写入模板和静态资源
    const todo = handleTpl(router, template.get(config.build_way, pageName, platform));

    if (config.build_way === 'vue') {
        const buidlEntry: BuidlEntry = {}
        const jsPath = helper.routerToEntryUrl(entryWritePath[platform], router, 'index.ts')
        buidlEntry[pageName] = jsPath;
        const oldEntry = platform == 'wap' ? wapEntry : pcEntry;
        const newEntry = JSON.stringify(Object.assign({}, oldEntry, buidlEntry), null, 4);
        const newEntryTpl = `export default ${newEntry}\n`;
        todo.push(files.writeFile(entryPath[platform], newEntryTpl))
    } 

    if (config.build_way === 'react') {
        const buidlEntry: BuidlEntry = {}
        const jsPath = helper.routerToEntryUrl(entryWritePath[platform], router, 'index.tsx')
        buidlEntry[pageName] = jsPath;
        const oldEntry = platform == 'wap' ? wapEntry : pcEntry;
        const newEntry = JSON.stringify(Object.assign({}, oldEntry, buidlEntry), null, 4);
        const newEntryTpl = `export default ${newEntry}\n`;
        todo.push(files.writeFile(entryPath[platform], newEntryTpl))
    }
    // 写入entry
    
    return helper.promiseAll(todo);
}
interface Answer {
    [index: string]: string
}
// 初始化
const askUser = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'router_name',
            message: '请输入路由的名称（如：project 或 project/view）：',
            validate: (value) => {
                if (helper.checkRouterName(value)) {
                    return true
                } else {
                    return '请输入符合路由规则的名称。'
                }
            }
        }
    ])
        .then((answers: Answer) => {
            result = answers
            let list = []
            list.push(files.checkFileExists(helper.routerToView(viewsPath[platform], answers.router_name)))
            return helper.promiseAll(list)
        })
        .then(() => {
            askBuild()
        })
        .catch((path) => {
            console.error('已经存在目录：' + path)
            askUserAfterFilesExits()
        })



}

const askUserAfterFilesExits = () => {
    inquirer.prompt([{
        type: 'Confirm',
        name: 'keep_going',
        message: '目录已经存在，是否要覆盖？（请注意entry文件是否冲突）(y/N)',
        default: false
    }])
        .then((answers: Answer) => {
            if (answers.keep_going) {
                askBuild()
            } else {
                throw ('Have A Nice Day.')
            }
        })
}

const askBuild = () => {
    inquirer.prompt([
        {
            type: 'list',
            name: 'build_way',
            message: '请选择构建方式：',
            choices: () => {
                return [
                    {
                        name: '手动引入静态资源',
                        value: 'normal'
                    },
                    {
                        name: '使用.vue文件系统',
                        value: 'vue'
                    },
                    {
                        name: '使用react文件系统',
                        value: 'react'
                    }
                ]
            }
        }
    ])
        .then((answers) => {
            return build(Object.assign(result, answers))
        })
        .then((path) => {
            console.log(chalk.green('生成成功：'))
            console.log(chalk.blue(JSON.stringify(path, null, 4)))
            console.log(chalk.yellow('请自行创建controllers。'))
            console.log(chalk.yellow('请使用"npm run dev"运行项目，或使用"npm run buidl"构建项目。'))
        })
        .catch((err) => {
            if (err.code && err.code === 'ENOENT') {
                // 忽略路径不存在的错误，路径会被自动创建
            } else {
                console.log(chalk.red('生成失败'))
                console.log(chalk.red(err))
            }
        })
}

askUser()
