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
        })
    ],
    devtool: 'nosources-source-map',
    mode: 'development'
}