import * as path from 'path';
interface Template{
    [index: string]:any
}
export function get(build_way: string, name:string, platform:string): object {
    let layout_path = '';
    if (platform === 'wap') {
        platform = 'wap'
        layout_path = path.relative('/server/html/views_mobile/'+name.split('_').slice(0, name.split('_').length-1).join('/'), '/server/html/views_mobile/layout.html');
    } else {
        platform = 'pc'
        layout_path = path.relative('/server/html/views/'+name.split('_').slice(0, name.split('_').length-1).join('/'), '/server/html/views/layout.html');
    }
    let template:Template = {
        vue: {
            html: `{% extends '${layout_path}' %}\n{% block head %}\n<link rel="stylesheet" href="{{'/dist/${platform}/css/${name}.css'|md5_url}}">\n{% endblock %}\n{% block content %}\n<div id="${name}" class="g_container">\n</div>\n<script src="{{'/dist/${platform}/js/manifest.js'|md5_url}}"></script>\n<script src="{{'/dist/${platform}/js/vendor.js'|md5_url}}"></script>\n<script src="{{'/dist/${platform}/js/${name}.js'|md5_url}}"></script>\n{% endblock %}`,
            ts: `import Vue from \'vue\'\nimport App from \'./index.vue\'\n\nnew Vue({\n  el: \'#${name}\',\n  render: h => h(App)\n})`,
            vue: `<template>\n    <div>\n\n    </div>\n</template>\n\n<script lang="ts">\nexport default {\n    \n}\n</script>\n\n<style lang="scss">\n\n</style>\n`,
        },
        react: {
            html: `{% extends '${layout_path}' %}\n{% block head %}\n<link rel="stylesheet" href="{{'/dist/${platform}/css/${name}.css'|md5_url}}">\n{% endblock %}\n{% block content %}\n<div id="${name}">\n</div>\n<script src="{{'/dist/${platform}/js/manifest.js'|md5_url}}"></script>\n<script src="{{'/dist/${platform}/js/vendor.js'|md5_url}}"></script>\n<script src="{{'/dist/${platform}/js/${name}.js'|md5_url}}"></script>\n{% endblock %}`,
            "components/main.tsx":  `import * as React from 'react'\nimport { Component } from "react";\nimport "./main.scss";\n\nexport default class App extends Component {\n    render(){\n        return (<div></div>)\n    }\n}`,
            ts: `//描述文件`,
            tsx: `import * as React from 'react'\nimport * as ReactDOM from 'react-dom'\nimport App from './components/main';\n\nReactDOM.render(<App />, document.getElementById('${name}'));`,
            'components/main.scss': `//style\n@import "src/common/css/base.scss";`
        },
        normal: {
            html: `{% extends '${layout_path}' %}\n{% block head %}<link rel="stylesheet" />\n{% endblock %}\n{% block content %}\n<div id="${name}">\n</div>\n{% endblock %}`,
        }
    }

    return template[build_way];
}
