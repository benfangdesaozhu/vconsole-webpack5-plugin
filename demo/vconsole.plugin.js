const path = require('path');
class vconsolePlugin {
    constructor(options) {
        this.options = Object.assign({
            enable: false
        }, options)
    }
    apply(compiler) {
        const vConsolePath = path.join('./vconsole.js')
        compiler.hooks.entryOption.tap('vconsolePlugin', (compilation, entry) => {
            if(this.options.enable){
                entry.main.import.push(`./${vConsolePath}`)
            }
        }) 
    }
}
module.exports = vconsolePlugin