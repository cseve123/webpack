// 打包原理的实现
// 1. 读取入口分析代码
// 2. 解析文件中的依赖，不用字符串截取不灵活，利用@babel/parser来分析语法，返回ast抽象语法树
// 3. 遍历AST的分析结果，找出引入的模块，利用@babel/traverse
// 得到了:入口文件、入口文件引入的模块（引入路径，在项目里的路径），可以在浏览器里执行代码
// 4. 修改数组以键值方式，找到并存储引入模块的项目路径
// 5. 将入后AST，转换成可运行代码，需要用到@babel/core和@babel/preset-env
// 6. 解析所有的模块，循环递归
const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');  // 解析代码，返回抽象树
const traverse = require('@babel/traverse').default;  // 找抽象树引入模块
const babel = require('@babel/core');  // 解析AST用 

const fenximokuai = (filename) => {
    // 1. 读取入口代码
    const content = fs.readFileSync(filename, 'utf-8');
    // 2. 解析代码形成抽象树
    // [
    //     Node {
    //         type: 'ImportDeclaration',
    //         start: 0,
    //         end: 22,
    //         loc: SourceLocation { start: [Position], end: [Position] },
    //         specifiers: [],
    //         source: Node {
    //         type: 'StringLiteral',
    //         start: 7,
    //         end: 21,
    //         loc: [SourceLocation],
    //         extra: [Object],
    //         value: '../css/a.css'
    //         }
    //     },
    //     Node {
    //         type: 'ImportDeclaration',
    //         start: 23,
    //         end: 49,
    //         loc: SourceLocation { start: [Position], end: [Position] },
    //         specifiers: [],
    //         source: Node {
    //         type: 'StringLiteral',
    //         start: 30,
    //         end: 48,
    //         loc: [SourceLocation],
    //         extra: [Object],
    //         value: '../css/index.css'
    //         }
    //     },
    //     Node {
    //         type: 'ImportDeclaration',
    //         start: 50,
    //         end: 77,
    //         loc: SourceLocation { start: [Position], end: [Position] },
    //         specifiers: [],
    //         source: Node {
    //         type: 'StringLiteral',
    //         start: 57,
    //         end: 76,
    //         loc: [SourceLocation],
    //         extra: [Object],
    //         value: '../css/index.less'
    //         }
    //     },
    //     Node {
    //         type: 'ImportDeclaration',
    //         start: 78,
    //         end: 108,
    //         loc: SourceLocation { start: [Position], end: [Position] },
    //         specifiers: [ [Node] ],
    //         source: Node {
    //         type: 'StringLiteral',
    //         start: 98,
    //         end: 107,
    //         loc: [SourceLocation],
    //         extra: [Object],
    //         value: '../expo'
    //         }
    //     },
    //     Node {
    //         type: 'ExpressionStatement',
    //         start: 109,
    //         end: 132,
    //         loc: SourceLocation { start: [Position], end: [Position] },
    //         expression: Node {
    //         type: 'CallExpression',
    //         start: 109,
    //         end: 131,
    //         loc: [SourceLocation],
    //         callee: [Node],
    //         arguments: [Array]
    //         }
    //     },
    //     Node {
    //         type: 'ExpressionStatement',
    //         start: 133,
    //         end: 154,
    //         loc: SourceLocation { start: [Position], end: [Position] },
    //         expression: Node {
    //         type: 'CallExpression',
    //         start: 133,
    //         end: 153,
    //         loc: [SourceLocation],
    //         callee: [Node],
    //         arguments: [Array]
    //         }
    //     }
    // ]
    const Ast = parser.parse(content, {
        sourceType: 'module'
    })
    
    // 3. 分享AST抽象语法树，返回对应的模块，定义一个数组
    // 接受node.source.value的值,存储引入的模块项目路径
    const dependencies = {};
    traverse(Ast, {
        ImportDeclaration ({ node }) {
            // 引入模块在项目中的路径
            const dirname = path.dirname(filename);
            const newfilename = './' + path.join(dirname, node.source.value);
            // 存储起来
            dependencies[node.source.value] = newfilename;
        }
    })
    // 5. 转换AST为合适的代码
    const { code } = babel.transformFromAst(Ast, null, {
        presets: ['@babel/preset-env']
    });
    // console.log(dependencies);
    return {
        filename,
        dependencies,
        code
    }
}

// 6. 解析所有模块,循环递归
const makeDependenciesGraph = (entry) => {
    const entryModule = fenximokuai(entry);
    const graphArray = [ entryModule ];
    for (let i = 0;i< graphArray.length; i++) {
        const item = graphArray[i];
        const { dependencies } = item;
        if ( dependencies ) {
            for (let j in dependencies) {
                graphArray.push(
                    fenximokuai(dependencies[j])
                );
            }
        }
    }
    // 每个路径的键值对
    const graph = {};
    graphArray.forEach(item => {
        graph[item.filename] = {
            dependencies: item.dependencies,
            code: item.code
        }
    })
    console.log(graph);
    return graph;
}

const generateCode = ( entry ) => {
    console.log(makeDependenciesGraph(entry));
    // const graph = JSON.stringify(makeDependenciesGraph(entry));
    // return `
    //     (function (graph) {
    //         function require(module) {
    //             function localRequire(relativePath) {
    //                 return require(graph[module].dependencies[relativePath]);
    //             }
    //             var exports = {};
    //             (function(require, exports, code){
    //                 eval(code)
    //             })(localRequire, exports, graph[module].code);
    //             return exports;
    //         };
    //         require('${entry}');
    //     })(${graph});
    // `
}
const moduleInfo = generateCode('./src/index/index.js');
console.log('infoxxxxxxxxxxxxx', moduleInfo);