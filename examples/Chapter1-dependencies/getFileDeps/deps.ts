import { parse } from "@babel/parser"
import traverse from "@babel/traverse"
import { readFileSync } from 'fs'
import { resolve, relative } from 'path';

type DepRelation = {[filename: string]: { deps: string[], code: string }}
const projectRoot = resolve(__dirname, 'project_1')

const depRelation = collectCodeAndDeps(resolve(projectRoot, 'index.js'))

console.log(depRelation)
console.log('done')

function collectCodeAndDeps(absoluteFilePath: string): DepRelation {
  const key = relative(projectRoot, absoluteFilePath)
  const code = readFileSync(absoluteFilePath, 'utf8');
  const ast = parse(code, {sourceType: 'module'});

  const depRelation: DepRelation  = {[key]: { deps:[], code }}

  traverse(ast,{
    enter(path) {
      if (path.node.type === 'ImportDeclaration') {
        const sourcePath = path.node.source.value
        depRelation[key].deps.push(sourcePath)
      }
    },
  })

  return depRelation
}





