const Logger = require('ocbesbn-logger'); // Logger
const main = require('./main');

const logger = new Logger({ context: { serviceName: 'business-partner' } });

if(process.env.NODE_ENV !== 'development')
  logger.redirectConsoleOut(); // Force anyone using console.* outputs into Logger format.

(() => main().catch(err => { console.error(err); main.end(); }))();
