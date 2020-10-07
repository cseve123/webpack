const { call } = require('file-loader');
// loader本质是一个声明函数，以源代码作为参数，使用this上下文, query用来查参数
const loaderUtils = require('loader-utils');  // loader-utils 处理loader.options
module.exports = function (source) {
    // console.log('+++++++++++++++++++++++++++++++++++++', source, this, this.query);
    // console.log('js_________________', this.query);
    const options = loaderUtils.getOptions(this);  // loader-utils处理参数
    // console.log('js_________________', this.query.name);
    // return source.replace('detail', options.name);
    // const result = source.replace('detail', options.name);
    // this.callback 可以用于返回更多信息
    // this.callback(
    //     err: Error | null,
    //     content: string | Buffer,
    //     sourceMap?: SourceMap,
    //     meta?: any
    // )
    // this.callback(null, result);
    const callback = this.async();  // 异步处理，返回this.callback
    setTimeout( () => {
        const result = source.replace('detail', options.name);
        callback(null, result);
    }, 300);
}