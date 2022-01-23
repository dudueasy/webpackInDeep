import { parse } from "@babel/parser"
import traverse from "@babel/traverse"
import { readFileSync } from 'fs'
import { resolve, relative } from 'path';

const PROJECT_DIR_NAME = 'project'
type DepRelation = {[filename: string]: { deps: string[], code: string }}

const projectRoot = resolve(__dirname, PROJECT_DIR_NAME )
const entry = resolve(projectRoot, 'index.js')

const depRelation = collectCodeAndDeps(entry)

console.log(depRelation)
console.log('done')

function collectCodeAndDeps(absoluteFilePath: string): DepRelation {
  const fileName = relative(projectRoot, absoluteFilePath)
  console.log(`fileName`, fileName)

  const code = readFileSync(absoluteFilePath, 'utf8');
  const ast = parse(code, {sourceType: 'module'});

  const depRelation: DepRelation  = {[fileName]: { deps:[], code }}

  traverse(ast,{
    enter(path) {
      const code = readFileSync(absoluteFilePath, 'utf8');
      if (path.node.type === 'ImportDeclaration') {
        const sourcePath = path.node.source.value
        depRelation[fileName].deps.push(sourcePath)
      }
    },
  })

  return depRelation
}





