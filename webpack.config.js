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
//     rules: {
//       test: /\.xxx$/,
//       use: {
//         loader: 'xxx-loader',
//         options: {}
//       }

//     }
//   }
// }