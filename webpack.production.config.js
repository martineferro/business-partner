const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    editor: './src/client/components/BusinessPartner/Editor/index.js',
    creator: './src/client/components/BusinessPartner/Creator/index.js',
    registrator: './src/client/components/BusinessPartner/Registrator/index.js',
    autocomplete: './src/client/components/BusinessPartner/Autocomplete/index.js',
    list: './src/client/components/BusinessPartner/List/index.js',
    directory: './src/client/components/BusinessPartner/Directory/index.js',
    visibility: './src/client/components/BusinessPartner/VisibilityPreference/index.js',
    organization: './src/client/components/BusinessPartner/Organization/index.js',
    address: './src/client/components/BusinessPartner/Address/index.js',
    bank_account: './src/client/components/BusinessPartner/BankAccount/index.js'
  },
  output: {
    path: path.resolve(__dirname, './src/server/static'),
    publicPath: '/static',
    filename: 'components/[name]-bundle.js',
    library: 'business-partner-[name]',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },

  //exclude empty dependencies, require for Joi
  node: {
    net: 'empty',
    tls: 'empty',
    dns: 'empty'
  },

  bail: true,
  // devtool: 'source-map',

  plugins: [
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en|de/)
  ],

  resolve: {
    extensions: ['.json', '.jsx', '.js']
  },

  resolveLoader: {
    extensions: ['.js']
  },

  module: {
    rules: [
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.css$/,
        loader: "style-loader!css-loader"
      },
      {
        test: /\.less$/,
        loader: 'style-loader!css-loader!less-loader'
      },
      {
        test: /.jsx?$/,
        loader: 'babel-loader',
        include: [
          path.join(__dirname, 'src')
        ],
        options: {
          presets: [
            ['es2015', {modules: false}],
            'react',
            'stage-0'
          ],
          plugins: ['transform-decorators-legacy']
        }
      }
    ]
  }
};
