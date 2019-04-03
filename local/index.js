const server = require('@opuscapita/web-init'); // Web server
const dbInit = require('@opuscapita/db-init'); // Database

async function init()
{
  const db = await dbInit.init({ retryTimeout : 1000, retryCount : 50, consul : { host: 'consul' }});

  await server.init({
    server : {
      staticFilePath: __dirname + '/../src/server/static',
      indexFilePath: __dirname + '/index.html',
      port : process.env.PORT || 3046,
      enableBouncer : false,
      enableEventClient : true,
      webpack: {
        useWebpack: true,
        configFilePath: __dirname + '/../webpack.development.config.js'
      },
    },
    routes : { dbInstance : db },
    serviceClient : {
      injectIntoRequest : true,
      consul : { host : 'consul' }
    }
  });
}

(() => init().catch(err => {
  server.end();
  throw err;
}))();
