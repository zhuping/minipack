
    (function(modules) {
      function require(id) {
        const [fn, mapping] = modules[id];
        function localRequire(relativePath) {
          return require(mapping[relativePath]);
        }
        const module = { exports: {} };

        fn(module, module.exports, localRequire);
        return module.exports;
      }
      require(0);
    })({0:[
      function(module, exports, require) {
        "use strict";

var _message = _interopRequireDefault(require("/message.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

console.log(_message.default);
      },
      {"/message.js":1},
    ],1:[
      function(module, exports, require) {
        "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _name = require("./name.js");

var _default = "hello ".concat(_name.nickname, "!");

exports.default = _default;
      },
      {"./name.js":2},
    ],2:[
      function(module, exports, require) {
        "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.nickname = void 0;

var _message = _interopRequireDefault(require("/message.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var nickname = 'jax';
exports.nickname = nickname;
      },
      {},
    ],})
  