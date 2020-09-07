const json = require("./index.json");  // commonjs
import { add } from './other'; // es module
console.log(json, add(2, 3));