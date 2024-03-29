const server = require('@opuscapita/web-init'); // Web server
const dbInit = require('@opuscapita/db-init'); // Database
const Logger = require('ocbesbn-logger');

// Basic database and web server initialization.
// See database : https://github.com/OpusCapita/db-init
// See web server: https://github.com/OpusCapita/web-init
async function init(config)
{
  const db = await dbInit.init(config && config.db);
  const logger = new Logger();

  await server.init({
    server : {
      port : process.env.port || 3046,
      staticFilePath: __dirname + '/static',
      enableBouncer : false,
      enableEventClient : true,
      events : {
        onStart: () => logger.info('Server ready. Allons-y!')
      }
    },
    routes : { dbInstance : db },
    serviceClient : {
      injectIntoRequest : true,
      consul : { host : 'consul' }
    }
  });
};

async function end()
{
  return server.end();
}

module.exports = init;
module.exports.end = end;
