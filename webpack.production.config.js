const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    'business-partner-editor': './src/client/components/BusinessPartner/Editor/index.js',
    'business-partner-creator': './src/client/components/BusinessPartner/Creator/index.js',
    'business-partner-registrator': './src/client/components/BusinessPartner/Registrator/index.js',
    'business-partner-autocomplete': './src/client/components/BusinessPartner/Autocomplete/index.js',
    'business-partner-list': './src/client/components/BusinessPartner/List/index.js',
    'business-partner-directory': './src/client/components/BusinessPartner/Directory/index.js',
    'business-partner-visibility': './src/client/components/BusinessPartner/VisibilityPreference/index.js',
    'business-partner-organization': './src/client/components/BusinessPartner/Organization/index.js',
    'business-partner-address': './src/client/components/BusinessPartner/Address/index.js',
    'business-partner-bank-account': './src/client/components/BusinessPartner/BankAccount/index.js',
    'business-partner-contact': './src/client/components/BusinessPartner/Contact/index.js',
    'business-partner-profile-strength': './src/client/components/BusinessPartner/ProfileStrength/index.js',
    'business-partner-access-approval': './src/client/components/BusinessPartner/Approval/index.js',
    'business-link-overview': './src/client/components/BusinessLink/ConnectionsOverview/index.js',
    'business-link-widget': './src/client/components/BusinessLink/ConnectionsWidget/index.js',
    'business-link-connections': './src/client/components/BusinessLink/Connections/index.js',
    'business-link-businessLinks': './src/client/components/BusinessLink/List/index.js',
    'business-link-editor': './src/client/components/BusinessLink/Editor/index.js'
  },
  output: {
    path: path.resolve(__dirname, './src/server/static'),
    publicPath: '/static',
    filename: 'components/[name]-bundle.js',
    library: '[name]',
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
