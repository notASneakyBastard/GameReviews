var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: [
    './src/index.js',
    //'webpack-dev-server/client?http://localhost:4790',
    //'webpack/hot/dev-server'
  ],
  externals: {
    "@shoutem/redux-io": true,
    "@shoutem/react-web-ui": true,
    "@shoutem/web-core": true,
    "classnames": true,
    "context": true,
    "environment": true,
    "react": true,
    "react-bootstrap": true,
    "react-dom": true,
    "react-redux": true,
    "redux": true,
    "redux-api-middleware": true,
    "redux-thunk": true,
    "validator": true
  },
  module: {
    loaders: [{
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
    }, {
      test: /\.css$/,
      loader: "style-loader!css-loader"
    }, {
      test: /\.scss$/,
      loader: "style-loader!css-loader!postcss-loader!sass-loader"
    }, {
      test: /\.(png|jpg)$/,
      loader: 'url-loader'
    },{
      test: /\.svg(\?.*)?$/,
      loader: 'url?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=image/svg+xml'
    }]
  },
  output: {
    libraryTarget: 'amd',
    path: path.resolve('./build'),
    filename: 'index.js',
    publicPath: '/server/build/',
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
    root: [
      path.resolve('./src'),
      path.resolve('./node_modules')
    ]
  },
  plugins: [
    //new webpack.HotModuleReplacementPlugin(),
    ///new webpack.NoErrorsPlugin()
  ],
};
