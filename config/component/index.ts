import * as path from 'path';
// import * as http from 'http';
import * as inquirer from 'inquirer';
import * as files from './files';
import * as template from './template';
import * as helper from './helper';

const chalk = require('chalk');
const rootPath = path.resolve(__dirname, '../../');

interface Platform_Config {
    [index: string]: string
}
const componentPath: Platform_Config = {
    wap: rootPath + '/fe/src/wap/components/',
    pc: rootPath + '/fe/src/pc/components/',
}

const platform = process.env.PLATFORM ? process.env.PLATFORM : 'wap'

let result = {} // 用户输入的构建条件最终结果

// 处理要写入的模板，PHP、JS、CSS、VUE
const handleTpl = (component_name:string, tpl: any) => {
    let list = []
    for (let key in tpl) {
        list.push(files.writeFile(componentPath[platform] + component_name + '.' + key, tpl[key])
        )
    }
    return list
}

// 写入文件和entry
const build = (config: any) => {
    const component_name = config.component_name
    // 写入模板和静态资源
    const todo = handleTpl(component_name, template.get(component_name));
    
    return helper.promiseAll(todo);
}
interface Answer {
    [index: string]: string
}
// 初始化
const askName = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'component_name',
            message: '请输入组件名称（如：Modal，建议组件名称首字母大写）：',
            validate: (value) => {
                if (value) {
                    return true
                } else {
                    return '请输入组件名称'
                }
            }
        }
    ])
        .then((answers: Answer) => {
            result = answers
            let list = []
            list.push(files.checkFileExists(componentPath[platform] + answers.component_name))
            return helper.promiseAll(list)
        })
        .then(() => {
            build(Object.assign(result))
                .then((path:any)=>{
                    console.log(chalk.green('生成成功：'))
                    console.log(chalk.blue(JSON.stringify(path, null, 4)))
                    console.log(chalk.yellow('请自行创建controllers。'))
                    console.log(chalk.yellow('请使用"npm run dev"运行项目，或使用"npm run buidl"构建项目。'))
                })
                .catch((err:any)=>{
                    console.error(err);
                })
        })
        .catch((path) => {
            console.error('已经存在目录：' + path)
        })

}

askName()
