import {parse} from "@babel/parser"
import traverse from "@babel/traverse"
import {transform} from "@babel/core";
import {readFileSync, writeFileSync, existsSync, mkdirSync} from 'fs'
import {resolve, relative, dirname} from 'path';

type DepRelation = { key: string, deps: string[], code: string };

// init path
const PROJECT_DIR_NAME = 'project'
const ENTRY_FILE = 'index.js';

const BUNDLE_DIR =  resolve(__dirname, 'dist');
const BUNDLE_NAME = 'bundle.js';
const BUNDLE_PATH = resolve(BUNDLE_DIR, BUNDLE_NAME);

const projectRoot = resolve(__dirname, PROJECT_DIR_NAME);
const entryPath = resolve(projectRoot, ENTRY_FILE);

// collect deps
const depRelation: DepRelation[] = [];
collectCodeAndDeps(entryPath);

createBundleDir();
writeFileSync(BUNDLE_PATH, generateCode())

// 创建 bundle 目录
function createBundleDir(){
  if(!existsSync(BUNDLE_DIR)){
    mkdirSync(BUNDLE_DIR, {recursive: true})
  }
}

/** function definitions */
function generateCode() {
  let code = ""
  code += "var depRelation = [\n" +
    depRelation.map((item) => {
      const {key, deps, code} = item
      return `{ 
            key: ${JSON.stringify(key)},
            deps: ${JSON.stringify(deps)},
            code: function(require, module, exports){
               ${code}
            }
         }`
    }).join(",\n") + "\n];"

  code += "var modules = {};"
  code += "execute(depRelation[0].key);"
  code += `function execute(key){
    if(modules[key]){
      return modules[key]; 
    };
    
    const item = depRelation.find((i)=> i.key === key);
    
    if(!item) {
      throw new Error('file no found');
    }
    
    var pathToKey = (path) => {
      var dirname = key.substring(0, key.lastIndexOf('/') + 1) 
      var projectPath = (dirname + path).replace(\/\\.\\\/\/g, '').replace(\/\\\/\\\/\/, '/')
      return projectPath
    }
    
    var require = (path) => {
      return execute(pathToKey(path))
    } 
      
    modules[key] = {__esModule: true}; 
    var module = { exports: modules[key] } 
    
    item.code(require, module, module.exports) 
    return modules[key];
  }`

  return code
}

function collectCodeAndDeps(filePath: string): DepRelation {
  const key = getProjectPath(filePath)
  // 一旦检查到这个文件名已经收集过依赖,  就退出, 从而解决循环依赖
  if (depRelation.find((item) => item.key === key)) {
    return
  }

  let rawCode = readFileSync(filePath, 'utf8');
  let code = rawCode

  // 检查是否是 css 文件, 如果是 css , 那么动态创建 style 标签
  if(/.*\.css$/.test(filePath)){
      let tempName = 'temp'
      rawCode = require('./loaders/css-loader')(rawCode, tempName);
      rawCode = require('./loaders/style-loader.js')(rawCode, tempName);
      code = rawCode
  }

  // step1: transform code
  const {code: es5Code} = transform(code, {presets: ['@babel/preset-env']});

  // step2: init depRelation[key]
  const item = {key, deps: [], code: es5Code}
  // step2: `先 push, 才能保证入口文件顺序
  depRelation.push(item)

  // step3: 将代码转换为 AST 并收集当前文件的依赖
  const ast = parse(code, {sourceType: 'module'});
  traverse(ast, {
    enter(path) {
      if (path.node.type === 'ImportDeclaration') {
        // 依赖相对当前文件的位置
        const importedFilePath = path.node.source.value;
        // 依赖的绝对位置
        const absoluteImportFilePath = resolve(dirname(filePath), importedFilePath);

        // 依赖相对于 根目录的路径
        const relativePathToProjectPath = getProjectPath(absoluteImportFilePath);
        item.deps.push(relativePathToProjectPath);
        collectCodeAndDeps(absoluteImportFilePath);
      }
    },
  })
}

// 获取文件相对于根目录的相对路径
function getProjectPath(path: string) {
  // 替换路径分隔符 (from windows to POSIX)
  return relative(projectRoot, path).replace(/\\/g, '/')
}
