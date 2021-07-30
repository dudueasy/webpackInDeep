import { parse } from "@babel/parser"
import traverse from "@babel/traverse"
import { readFileSync } from 'fs'
import { resolve, relative, dirname } from 'path';

const PROJECT_DIR_NAME = 'project_2'
type DepRelation = {[filename: string]: { deps: string[], code: string }}
const projectRoot = resolve(__dirname, PROJECT_DIR_NAME )

const depRelation = {}
collectCodeAndDeps(resolve(projectRoot, 'index.js'))

console.log(depRelation)
console.log('done')


function collectCodeAndDeps(entryPath: string): DepRelation {
  const fileName = relative(projectRoot, entryPath)
  const code = readFileSync(entryPath, 'utf8');
  const ast = parse(code, {sourceType: 'module'});

  depRelation[fileName] = { deps:[], code }

  traverse(ast,{
    enter(path) {
      if (path.node.type === 'ImportDeclaration') {
        // 依赖相对当前文件的位置
        const importedFilePath = path.node.source.value
        // 依赖的绝对位置
        const absoluteImportFilePath = resolve(dirname(entryPath), importedFilePath)
        // 依赖相对于projectRoot 的位置
        const relativeImportFilePath = relative(projectRoot, absoluteImportFilePath)

        depRelation[fileName].deps.push(relativeImportFilePath)
        collectCodeAndDeps(absoluteImportFilePath);
      }
    },
  })

  return depRelation
}