const json = require("./index.json");  // commonjs
import { add } from './other'; // es module
console.log(json, add(2, 3));

import pic from './media/logo.png';
import './css/a.css';
import './css/index.css';
import './css/index.less';
import axios from 'axios';
import * as VarA from './number';

// webpack 配置了useBuiltIns: 'usage'则不需要
import '@babel/polyfill';  // polyfill ES6补充polyfill

var img = new Image();
img.src = pic;
img.classList.add('logo');
const root = document.getElementById('root');
const h1 = document.createElement('h1');
h1.innerText = 'webpack学习';
root.append(h1);
root.append(img);

axios.get('/api/info').then(res => console.log('api', res));

// js 模块化的手动监听和回调
console.log('VarA', VarA.default);
if (module.hot) {
    console.log('HMR开启')
    module.hot.accept('./number.js', function () {
        console.log('js手动模块，这个模块改动了', VarA.default);
    })
}

// babel转义测试
const arr = [new Promise(()=> {}), new Promise(()=> {})];
 
arr.map(item=> {
    console.log('babel', item);
})