module.exports = (code,  variableName) => `
  ${code}
  if (document) {
    const style = document.createElement('style');
    style.innerHTML = ${variableName};
    document.head.appendChild(style)
  }
`