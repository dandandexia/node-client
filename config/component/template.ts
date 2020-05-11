
export function get(component_name:string): object {
    return {
        tsx: `import * as React from 'react'\nimport { Component } from "react";\nimport './${component_name}.scss';\n\nexport default class ${component_name} extends Component {\n    render(){\n        return (<div></div>)\n    }\n}`,        
        scss: `@import "src/common/css/base.scss";`
    }

}
