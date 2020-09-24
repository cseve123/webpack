const json = require("./index.json");  // commonjs
import { add } from './other'; // es module
console.log(json, add(2, 3));

import pic from './media/logo.png';
import './css/a.css';
import './css/index.css';
import './css/index.less';

var img = new Image();
img.src = pic;
img.classList.add('logo');
const root = document.getElementById('root');
const h1 = document.createElement('h1');
h1.innerText = 'webpack学习';
root.append(h1);
root.append(img);
console.l();