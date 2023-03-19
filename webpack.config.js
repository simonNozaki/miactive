// Generated using webpack-cli https://github.com/webpack/webpack-cli
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackWatchedGlobEntries = require('webpack-watched-glob-entries-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const isProduction = process.env.NODE_ENV == 'production';
const stylesHandler = MiniCssExtractPlugin.loader;

// 複数のentryを受け付ける: https://shuu1104.com/2021/12/4458/
const entries = WebpackWatchedGlobEntries.getEntries([path.resolve(__dirname, './src/*.ts')], {
  ignore: path.resolve(__dirname, './src/_*.ts'),
})();

const config = {
  // entry: './src/index.ts',
  entry: entries,
  output: {
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
    open: true,
    host: 'localhost',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html',
    }),
    new HtmlWebpackPlugin({
      template: 'stock.html',
      filename: 'stock.html'
    }),
    new MiniCssExtractPlugin({
      filename: './public/css/style.css'
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/i,
        loader: 'ts-loader',
        exclude: ['/node_modules/'],
      },
      {
        test: /\.css$/i,
        use: [stylesHandler, 'css-loader', 'postcss-loader',],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: 'asset',
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js', '...'],
  },
};

module.exports = () => {
  if (isProduction) {
    config.mode = 'production';
  } else {
    config.mode = 'development';
  }
  return config;
};
