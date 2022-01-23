import {parse} from "@babel/parser"
import traverse from "@babel/traverse"
import {transform} from "@babel/core";
import {readFileSync} from 'fs'
import {resolve, relative, dirname} from 'path';

const PROJECT_DIR_NAME = 'project'
const ENTRY_FILE = 'index.js';

type DepRelation = { [filename: string]: { deps: string[], code: string } }

const projectRoot = resolve(__dirname, PROJECT_DIR_NAME)
const entryPath = resolve(projectRoot, ENTRY_FILE);

const depRelation: DepRelation = {};
collectCodeAndDeps(entryPath);

console.log(depRelation);
console.log('done');

function collectCodeAndDeps(filePath: string): DepRelation {
  const fileName = relative(projectRoot, filePath)

  // 一旦检查到这个文件名已经收集过依赖,  就退出, 从而解决循环依赖
  if (depRelation[fileName]) {
    return
  }
  const code = readFileSync(filePath, 'utf8');
  const {code: es5Code} = transform(code, {presets: ['@babel/preset-env']})
  console.log(`es5Code `, es5Code);

  const ast = parse(code, {sourceType: 'module'});

  // init depRelation[fileName]
  depRelation[fileName] = {deps: [], code: es5Code}

  traverse(ast, {
    enter(path) {


      if (path.node.type === 'ImportDeclaration') {
        // 依赖相对当前文件的位置
        const importedFilePath = path.node.source.value
        // 依赖的绝对位置
        const absoluteImportFilePath = resolve(dirname(filePath), importedFilePath)
        console.log(`importedFilePath `, importedFilePath)
        console.log(`absoluteImportFilePath `, absoluteImportFilePath)
        // 依赖相对于projectRoot 的位置
        const relativeImportFilePath = relative(projectRoot, absoluteImportFilePath)

        depRelation[fileName].deps.push(relativeImportFilePath)
        collectCodeAndDeps(absoluteImportFilePath);
      }
    },
  })

  return depRelation
}
