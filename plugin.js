// plguin是一个类，包含一个apply函数，参数是compiler
class CopyrightWebpackPlugin {
    // 接受参数
    constructor(options) {
        console.log(options);
    }

    // compiler: webpack实例，apply必备函数
    apply (compiler) {
        // hooks.emit 定义字啊某个时刻,更多查看webpack的compiler 生命周期
        compiler.hooks.emit.tapAsync(
            'CopyrightWebpackPlguin',
            (compilation, cb) => {
                compilation.assets['copyright.txt'] = {
                    source: function() {
                        return 'hello copy';
                    },
                    size: function() {
                        return 20;
                    }
                };
                cb();
            }
        )

        // 同步写法
        // compiler.hooks.compile.tap(
        //     'CopyrightWebpackPlugin',
        //     compilation => {
        //         console.log('开始了')
        //     }
        // )
    }
}
module.exports = CopyrightWebpackPlugin;