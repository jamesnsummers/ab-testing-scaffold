const path = require('path');
const glob = require('glob');
const ReplaceInFileWebpackPlugin = require('replace-in-file-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

console.info('\x1b[33m\x1b[1m%s\x1b[0m', '----------------- Starting Build ------------------');

// Build Confuration
const CONFIG = {
  dir: {
    build: 'build',
    src: './src'
  },
  bundleConcat: 'bundle'
};

CONFIG.entries = getSrcFiles();
CONFIG.cleanPattern = CONFIG.entries.map(entryName => `!${entryName}.bundle.js`);

console.info('\x1b[33m%s\x1b[0m','>>> Bundling Config');
console.info(CONFIG);

// Webpack Setup
module.exports = (CONFIG.entries).map((entryName) => ({
    mode: 'production',
    watch: true,
    context: path.join(__dirname, CONFIG.dir.src),
    entry: {
      [entryName]: `./${entryName}.js`
    },
    output: {
      path: path.join(__dirname, CONFIG.dir.build),
      filename: `[name].${CONFIG.bundleConcat}.js`
    },
    module: {
      rules: [
        {
          test: /\.scss$/,
          use: [
            { loader: 'css-loader' },
            { loader: 'sass-loader' }
          ]
        },
        {
          test: /\.html$/,
          use: {
            loader: 'html-loader',
            options: {
              interpolate: true
            }
          }
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
              plugins: ['@babel/plugin-proposal-object-rest-spread']
            }
          }
        }
      ]
    },
    resolve: {
      extensions: ['*', '.js', '.vue', '.json'],
      alias: {
        '@': path.resolve(CONFIG.dir.src),
      }
    },
    plugins: [
      // Remove deleted src files from the build folder
      new CleanWebpackPlugin({
        cleanOnceBeforeBuildPatterns: ['**/*'].concat(CONFIG.cleanPattern)
      }),

      // Optimizely validator workaround
      new ReplaceInFileWebpackPlugin(
        [{
          dir: CONFIG.dir.build,
          files: [`./${entryName}.${CONFIG.bundleConcat}.js`],
          rules: [
            {
              search: /\.default(?=[^\w$])/g,
              replace: "['default']"
            },
            {
              search: /^/,
              replace: "/* jshint ignore:start */\n"
            },
            {
              search: /$/,
              replace: "\n/* jshint ignore:end */"
            }
          ]
        }]
      )
    ]
  }));

// Get All Files
function getSrcFiles() {
  console.info('\x1b[33m%s\x1b[0m','>>> Getting Build Entries...');

  return glob.sync(`${CONFIG.dir.src}/*.js`).map(entryName => {
    console.info(`\t- Entry Found: ${entryName}`);
    return entryName.replace(`${CONFIG.dir.src}/`, '').replace('.js', '');
  }, {});
}