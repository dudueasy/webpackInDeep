// 使用 babel api 生成 AST 语法树
import {parse} from '@babel/parser';
import traverse from '@babel/traverse';
import generate from '@babel/generator';

// https://babeljs.io/docs/en/babel-parser#babelparserparsecode-options
const code = `let a = 'a'; const b = 2;`

// 使用 babel parse 生成 AST
const ast = parse(code, {sourceType: 'module'})
const y = traverse(ast, {
  enter: item => {
    if(item.node.type === 'VariableDeclaration'){
      if(item.node.kind === 'let'){
        item.node.kind = 'var'
      }
    }
  }
})
console.log(`y`, y)
const result = generate(ast, {}, code)
console.log(`result`, result)








