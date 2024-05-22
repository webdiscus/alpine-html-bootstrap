const path = require('path');
const webpack = require('webpack');
const HtmlBundlerPlugin = require('html-bundler-webpack-plugin');

// Project config data.
// Go here to change stuff for the whole demo, ie, change the navbar.
// Also go here for the various data loops, ie, category products, slideshows.
const projectData = {
  webRoot: '',
  config: require(path.join(__dirname, 'src/data/config.json')),
  'category-products': require(path.join(__dirname, 'src/data/category-products.json')),
  'cart-items': require(path.join(__dirname, 'src/data/cart-items.json')),
  'filters-one': require(path.join(__dirname, 'src/data/filters-one.json')),
  'options-size-one': require(path.join(__dirname, 'src/data/options-size-one.json')),
  'options-size-two': require(path.join(__dirname, 'src/data/options-size-two.json')),
  'slideshow-brands-one': require(path.join(__dirname, 'src/data/slideshow-brands-one.json')),
};

// Main webpack config options.
module.exports = (env, argv) => {
  const isDev = argv.mode === 'development';

  return {
    mode: isDev ? 'development' : 'production',
    devtool: isDev ? 'inline-source-map' :  'source-map' ,
    stats: 'minimal',

    output: {
      path: path.join(__dirname, 'dist/'),
    },

    resolve: {
      alias: {
        '@images': path.join(__dirname, 'src/assets/images'),
        '@fonts': path.join(__dirname, 'src/assets/fonts'),
        '@styles': path.join(__dirname, 'src/assets/scss'),
        '@scripts': path.join(__dirname, 'src/assets/js'),
      }
    },

    plugins: [
      new webpack.ProgressPlugin(),

      new HtmlBundlerPlugin({
        // automatically detect pages located in the directory
        entry: 'src/views/pages/',

        // -OR- you can define pages manually
        // entry: {
        //   index: './src/views/pages/index.html',
        //   category: './src/views/pages/category.html',
        //   product: './src/views/pages/product.html',
        //   cart: './src/views/pages/cart.html',
        //   checkout: './src/views/pages/checkout.html',
        //   'about/index': 'src/views/pages/about/index.html',
        // },

        js: {
          // JS output filename
          filename: 'assets/js/[name].[contenthash:8].js',
        },
        css: {
          // CSS output filename
          filename: 'assets/css/[name].[contenthash:8].css',
        },
        // external data used in templates
        data: projectData,
        // use Handlebars templating engine to render pages
        preprocessor: 'handlebars',
        preprocessorOptions: {
          views: [
            path.join(__dirname, 'src/views/partials/'),
          ],
          partials: [
            path.join(__dirname, 'src/views/partials/'),
          ],
          // custom handlebars helpers used in templates
          helpers: {
            limit: (arr, limit) => {
              if (!Array.isArray(arr)) { return []; }
              return arr.slice(0, limit);
            },
          },
        },
      }),
    ],

    module: {
      rules: [
        {
          test: /\.(sass|scss|css)$/,
          use: ['css-loader', 'postcss-loader', 'sass-loader'],
        },
        {
          test: /[\\/]images[\\/].+(png|jpe?g|webp|ico|svg)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'assets/img/[name].[hash:8][ext]',
          },
        },
        {
          test: /[\\/]fonts[\\/].+(woff2?|ttf|otf|eot|svg)$/,
          type: 'asset/resource',
          generator: {
            filename: 'assets/fonts/[name][ext]',
          },
        },
      ],
    },

    optimization: {
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /[\\/](node_modules)[\\/].+\.js$/,
            name: 'vendor',
            chunks: 'all'
          }
        }
      },
    },

    performance: {
      hints: false,
    },

    devServer: {
      static: {
        directory: path.join(__dirname, 'dist'),
      },
      // enable live reload
      watchFiles: {
        paths: ['src/**/*.*'],
        options: {
          usePolling: true,
        },
      },
    },

  };
}
