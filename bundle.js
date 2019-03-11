const fs = require('fs');
const path = require('path');
const babylon = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const babel = require('@babel/core');

/**
 * 根据文件路径获取信息
 */

let ID = 0;
function createAsset(filename) {
  const content = fs.readFileSync(filename, 'utf-8');

  const ast = babylon.parse(content, {
    sourceType: 'module'
  });

  let dependencies = [];

  traverse(ast, {
    ImportDeclaration: ({ node }) => {
      dependencies.push(node.source.value);
    }
  });

  const id = ID++;

  const { code } = babel.transformFromAstSync(ast, null, {
    presets: ['@babel/preset-env']
  });

  return {
    id,
    filename,
    dependencies,
    code
  };
}

/**
 * 深度遍历，获取文件所有依赖关系
 */

function createGraph(entry) {
  const mainAsset = createAsset(entry);

  const queue = [mainAsset];

  for (const asset of queue) {
    const dirname = path.dirname(asset.filename);

    asset.mapping = {};

    asset.dependencies.forEach(relativePath => {
      const absolutePath = path.join(dirname, relativePath);

      let child = queue.find(asset => asset.filename === absolutePath);

      if (!child) {
        child = createAsset(absolutePath);
        asset.mapping[relativePath] = child.id;
        queue.push(child);
      }
    });
  }

  return queue;
}

/**
 * 根据依赖关系生成能被对应环境执行的代码
 * @param {*} graph 
 */

function bundle(graph) {
  let modules = '';

  graph.forEach(mod => {
    modules += `${mod.id}:[
      function(module, exports, require) {
        ${mod.code}
      },
      ${JSON.stringify(mod.mapping)},
    ],`;
  });

  const results = `
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
    })({${modules}})
  `;
  return results;
}

const graph = createGraph('./example/entry.js');
const ret = bundle(graph);

fs.writeFileSync('./example/dist.js', ret);
