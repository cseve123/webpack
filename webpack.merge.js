const merge = require('webpack-merge');
const devConfig = require('./webpack.config');
const commonConfig = {};
// 根据环境进行合并
// module.exports = merge(commonConfig, devConfig);

// env 是在package里的script里webpack --env.production
module.exports = (env) => {
    if (env && env.prodution) {
        return merge(commonConfig, prudocutionConfig);
    } else {
        return merge(commonConfig, developmentConfig);
    }
}