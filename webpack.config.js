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

console.log('______________________', process.env.NODE_ENV);
module.exports = {
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
                }
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
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: 'HtmlWebpackPlugin',
            template: './src/index.html',
            filename: 'index.html'
        }),
        new MiniCssExtractPlugin({
            filename: '[name]_[hash:8].css'
        }),
        // HMR完全启动的配合
        new webpack.HotModuleReplacementPlugin()
    ],
    devtool: 'source-map',
    mode: 'development',
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
        proxy: { // 代理
            '/api': {
                target: 'http://localhost:9092'
            }
        }
    },
    // watch: true,  // 轮询监听文件变化，默认不开
    // watchOptions: { 
    //     ignored: /node_modules/,
    //     aggregateTimeout: 300, // 监听文件变化后等300ms再去执行
    //     poll: 1000 //ms, 判断文件是否发生变化是通过不停的询问指定文件
    // }

}