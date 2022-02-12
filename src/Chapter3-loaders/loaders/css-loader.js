/** 实现了 css => js 的转换
 * */
module.exports = (code, variableName) =>  {
  /** 细节: 这里的返回的文本等同于 普通 js 文件 readyFileSync 得到的字符串
   /* 因此代码中的字符串内容需要双层引号, 因为是 "字符串中的字符串"
   */
  return `
  const ${variableName} = ${JSON.stringify(code)};
  `
}