import * as path from 'path';
export function get(name:string, platform:string): object {
    let layout_path = '';
    if (platform === 'wap') {
        platform = 'wap'
        layout_path = path.relative('/server/html/views_mobile/'+name.split('_').slice(0, name.split('_').length-1).join('/'), '/server/html/views_mobile/layout.html');
    } else {
        platform = 'pc'
        layout_path = path.relative('/server/html/views/'+name.split('_').slice(0, name.split('_').length-1).join('/'), '/server/html/views/layout.html');
    }
    return {
        html: `{% extends ${layout_path} %}\n{% block title %} {{title}} {% endblock %}\n{% block head %}\n<link type="stylesheet" src="/fe/dist/${platform}/${name}.css">\n{% endblock %}\n{% block content %}\n<script src="/fe/dist/${platform}/manifest.js"></script>\n<script src="/fe/dist/${platform}/vendor.js"></script>\n<script src="<?= _url('/fe/dist/${platform}/${name}.js')?>"></script>\n{% endblock %}`,
        js: `import Vue from \'vue\'\nimport App from \'./index.vue\'\n\nnew Vue({\n  el: \'#${name}\',\n  template: \'<App/>\',\n  components: { App }\n})\n`,
        vue: `<template>\n    <div>\n\n    </div>\n</template>\n\n<script>\nexport default {\n    name: '${name}'\n}\n</script>\n\n<style lang="scss">\n\n</style>\n`,
    }
}
