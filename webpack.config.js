// 默认配置有webpack就行
// const path = require('path');
// module.exports = {
//   entry: './src/index.js',
//   output: {
//     filename: 'main.js',
//     path: path.resolve(__dirname, './dist')
//   }
// }

// 基础组成部分
// module.exports = {
//   entry: './src/index.js',
//   output: './dist',
//   mode: 'production',
//   module: {
//     rules: [
//       {
//         test: /\.css$/,
//         use: 'style-loader'
//       }
//     ]
//   },
//   plugins: [
//     new HtmlWebpackPlugin()
//   ]
// }

// entry基础形式，还可以是函数
// module.exports = {
//   entry: './src/index.js', // 单入口
//   entry: {  // 多入口
//     index: './src/index.js',
//     login: './src/login.js'
//   }
// }

// output基础形式
// const path = require('path');
// module.exports = {
//   output: { // 单入口
//     filename: 'bundle.js',
//     path: path.resolve(__dirname, 'dist')
//   },
//   output: {
//     filename: '[name].[chunkhash:8].js',
//     path: path.resolve(__dirname, 'dist')
//   }
// }

// loader基础形式
// module.exports = {
//   module: {
//     rules: [
//       test: /\.xxx$/,
//       use: {
//         loader: 'xxx-loader',
//         options: {}
//       }

//     ]
//   }
// }

// loader plugin 使用
const HtmlWebpackPlugin = require('html-webpack-plugin'); // html处理
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); // 打包清除
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // css单文件处理
const webpack = require('webpack');
const path = require('path');
const glob = require('glob');  // glob.sync第三方库来匹配路径
// css 压缩
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
// css tree shaking
const PurifyCss = require('purifycss-webpack');
const globAll = require('glob-all');
const ENV = process.env.NODE_ENV;
console.log('______________________', process.env.NODE_ENV);

// 工具类的
// 各个插件和loader的消耗时间
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
const smp = new SpeedMeasurePlugin();
// module.exports = smp.wrap(config);  // 包所有的配置

// webpack打包的模块依赖关系
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
// DllPlugin 抽离模块缓存
const { DllPlugin } = require('webpack');
// new DllPlugin({
//     path: path.join(__dirname, './dll', '[name]-manifest.json'),
//     name: 'react'
// })

// happypack 多任务执行
// const HappyPack = require('happypack');
// const happyThreadPool = HappyPack.happyThreadPool({
//     size: os.cups().length
// })
// loader里
// use: ['happypack/loader?id=css']
// plugins里
// new HappyPack({
//     id: 'css',
//     loaders: ['style-loader', 'css-loader']
// })
// 自定义plguin
const CopyrightWebpackPlugin = require('./plugin');

// 多页面配置方案比较通用
const setMPA = () => {
    const entry = {};
    const htmlWebpackPlugins = [];
    const entryFiles = glob.sync(path.join(__dirname, './src/*/index.js'));
    console.log('array>>>>>>>>>>>>>>>', entryFiles)
    entryFiles.map((item, index) => {
        const entryFile = entryFiles[index];  // 绝对路径有问题读的是本地文件开始的
        console.log('~~~~~~~~~~~~~~~~~~~~~', entryFile);
        const match = entryFile.match(/src\/(.*)\/index\.js$/);
        const pageName = match && match[1];
        entry[pageName] = entryFile;
        htmlWebpackPlugins.push(
            new HtmlWebpackPlugin({
                title: pageName,
                filename: `${pageName}.html`,
                template: path.join(__dirname, `src/${pageName}/index.html`),
                chunks: [pageName],
                inject: true,
                // 压缩html
                minify: {
                    removeComments: true, // 删注释
                    collapseWhitespace: true, // 删空格和换行符
                    minifyCSS: true  // 压缩内联css
                }
            })
        )
    })

    return {
        entry,
        htmlWebpackPlugins
    }
}
const { entry, htmlWebpackPlugins } = setMPA();

console.log('>>>>>>>>>>', entry);
module.exports = {
    entry,
    resolve: {
        // 确定第三方查找路径
        modules: [path.join(__dirname, './node_modules')],
        // 别名映射
        alias: {
            'aliasReact': path.join(__dirname, './node_modules/react/umd/react.production.min.js'),
            'aliasReactDom': path.join(__dirname,'./node_modules/react-dom/umd/react-dom.production.min.js')
        },
        // 导入文件不用带后缀的配置
        extensions: ['.js', '.json', '.ts', '.jsx'],

        // 静态资源引入不打包
        // externals: {
        //     // 通过script引入，可在模块中import
        //     'jquery': 'jQuery'
        // }
    },
    optimization: {
        usedExports: true,  // 开启js tree shaking,仅支持ES6module
        splitChunks: {
            chunks: "all"  // 默认的代码分片，还可以具体在配置minisize等
        },
        concatenateModules: true  // 作用域提升，让依赖关系代码尽量在一个函数里
    },
    output: {
        // publicPath: '//cdn' // 对于静态资源的cdn路径
    },
    module: {
        rules: [
            // {  // file-loader 处理文件
            //     test: /\.(png|jpe?g|gif)$/,
            //     use: {
            //         loader: "file-loader",
            //         options: {
            //             name: "[name]_[hash:8].[ext]",
            //             outputPath: 'media/'
            //         }
            //     }
            // },
            {
                test: /\.(png|jpe?g|gif)$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        name: "[name]_[hash:8].[ext]",
                        limit: 2048,
                        outputPath: 'media/'
                    }
                },
                // 缩小loader范围
                include: path.resolve(__dirname, './src')
            },
            {
                test: /\.woff2$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: '[name]_[hash:8].[ext]',
                        outputPath: 'media/'
                    }
                }
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: 'style-loader',
                        options: {
                            injectType: 'singletonStyleTag'  // 多css合成一个
                        }
                    },
                    'css-loader'
                ]
            },
            {
                test: /\.less$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            esModule: true
                        }
                    },
                    'css-loader',
                    'postcss-loader',
                    'less-loader'
                ]
            },
            {
                test: /\.js$/,
                use: {
                    loader: path.resolve(__dirname, './loader.js'),
                    options: {
                        name: 'goods'    
                    }
                }
            },
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    // options: {
                    //     presets: [
                    //         [
                    //             '@babel/preset-env',
                    //             {
                    //                 targets: {
                    //                     edge: '17',
                    //                     firefox: '60',
                    //                     chrome: '67',
                    //                     safari: '11.1'
                    //                 },
                    //                 corejs: 2,
                    //                 useBuiltIns: 'usage' // 按需注入，这个值不用在入口import @babel/polyfill
                    //             }
                    //         ]
                    //     ]
                    // }
                },
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        ...htmlWebpackPlugins, 
        new MiniCssExtractPlugin({
            // contenthash以内容为建立hash,独立文件利于缓存
            filename: 'css/[name]_[contenthash:8].css'
        }),
        // HMR完全启动的配合
        new webpack.HotModuleReplacementPlugin(),
        // css 压缩
        new OptimizeCssAssetsPlugin({
            // cssnano 配置压缩选项
            cssProcessor: require('cssnano'),
            cssProcessorOptions: {
                discardComments: {
                    removeAll: true
                }
            }
        }),
        // css tree shaking
        new PurifyCss({
            paths: globAll.sync([
                //需要弄的路径html,js
                path.resolve(__dirname, './src/*.html'),
                path.resolve(__dirname, './src*.js')
            ])
        }),
        // 打包后的依赖关系
        new BundleAnalyzerPlugin(),
        // 自定义plguin
        new CopyrightWebpackPlugin({
            name: '自定义'
        })
    ],
    devtool: 'source-map',
    mode: ENV,
    devServer: {
        contentBase: './dist', // 最好绝对路径
        open: true, // 打开浏览器
        port: 8081,
        compress: true, // 静态文件gzip
        hot: true, // HMR
        hotOnly: true, // HMR不生效，浏览器不自刷新，就开启hotOnly
        overlay: { // 编译器错误或警告时
            warnings: true,
            errors: true
        },
        proxy: { // 代理api 返回数据结果
            '/api': {
                target: 'http://localhost:9092'
            }
        }
    },
    // watch: true,  // 轮询监听文件变化，默认不开  watch和watchOptions是自动更新，devserver默认开启
    // watchOptions: { 
    //     ignored: /node_modules/,
    //     aggregateTimeout: 300, // 监听文件变化后等300ms再去执行
    //     poll: 1000 //ms, 判断文件是否发生变化是通过不停的询问指定文件
    // }

}