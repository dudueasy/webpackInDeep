var depRelation = [
{ 
            key: "index.js",
            deps: ["a.js","b.js","style.css"],
            code: function(require, module, exports){
               "use strict";

var _a = _interopRequireDefault(require("./a.js"));

var _b = _interopRequireDefault(require("./b.js"));

require("./style.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

console.log(_a["default"].value + _b["default"].value);
            }
         },
{ 
            key: "a.js",
            deps: ["dir/a2.js"],
            code: function(require, module, exports){
               "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _a = _interopRequireDefault(require("./dir/a2.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var a = {
  value: 1,
  value2: _a["default"],
  value3: 'abc'
};
var _default = a;
exports["default"] = _default;
            }
         },
{ 
            key: "dir/a2.js",
            deps: ["dir/dir_in_dir/a3.js"],
            code: function(require, module, exports){
               "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _a = _interopRequireDefault(require("./dir_in_dir/a3.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var a2 = {
  value: 12,
  value3: _a["default"]
};
var _default = a2;
exports["default"] = _default;
            }
         },
{ 
            key: "dir/dir_in_dir/a3.js",
            deps: [],
            code: function(require, module, exports){
               "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var a3 = {
  value: 123
};
var _default = a3;
exports["default"] = _default;
            }
         },
{ 
            key: "b.js",
            deps: ["dir/b2.js"],
            code: function(require, module, exports){
               "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _b = _interopRequireDefault(require("./dir/b2.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var b = {
  value: 2,
  value2: _b["default"]
};
var _default = b;
exports["default"] = _default;
            }
         },
{ 
            key: "dir/b2.js",
            deps: ["dir/dir_in_dir/b3.js"],
            code: function(require, module, exports){
               "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _b = _interopRequireDefault(require("./dir_in_dir/b3.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var b2 = {
  value: 22,
  value3: _b["default"]
};
var _default = b2;
exports["default"] = _default;
            }
         },
{ 
            key: "dir/dir_in_dir/b3.js",
            deps: [],
            code: function(require, module, exports){
               "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var b3 = {
  value: 123
};
var _default = b3;
exports["default"] = _default;
            }
         },
{ 
            key: "style.css",
            deps: [],
            code: function(require, module, exports){
               "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var str = "body {\n    color: red;\n}";

if (document) {
  var style = document.createElement('style');
  style.innerHTML = str;
  document.head.appendChild(style);
}

var _default = str;
exports["default"] = _default;
            }
         }
];var modules = {};execute(depRelation[0].key);function execute(key){
    if(modules[key]){
      return modules[key]; 
    };
    
    const item = depRelation.find((i)=> i.key === key);
    
    if(!item) {
      throw new Error('file no found');
    }
    
    var pathToKey = (path) => {
      var dirname = key.substring(0, key.lastIndexOf('/') + 1) 
      var projectPath = (dirname + path).replace(/\.\//g, '').replace(/\/\//, '/')
      return projectPath
    }
    
    var require = (path) => {
      return execute(pathToKey(path))
    } 
      
    modules[key] = {__esModule: true}; 
    var module = { exports: modules[key] } 
    
    item.code(require, module, module.exports) 
    return modules[key];
  }