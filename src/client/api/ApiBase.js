const request = require('superagent');

class ApiBase {
  ajax = request;
  urlPath = '/business-partner/api/business-partners';
}

export default ApiBase;
