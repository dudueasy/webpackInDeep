import {parse} from '@babel/parser';
import * as babel from '@babel/core';
import * as fs from 'fs';
import * as path from 'path';

// 为了保证 node 运行结果的一致性 (启动 node 的位置可能不同), 使用绝对路径
const filePath = path.join(__dirname, './test.js')
console.log(`__dirname`, __dirname)
const code = fs.readFileSync(filePath).toString();
const ast = parse(code, { sourceType: 'module'});
const result = babel.transformFromAstSync(ast, code , {
  presets: ['@babel/preset-env']
})

fs.writeFileSync('./test.es5.js', result.code)

console.log(`result.code`, result.code)
