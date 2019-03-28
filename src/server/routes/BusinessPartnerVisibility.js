const BusinessPartnerVisibilityApi = require('../api/BusinessPartnerVisibility');

class BusinessPartnerVisibility {
  constructor(app, db) {
    this.app = app;
    this.api = new BusinessPartnerVisibilityApi(db);
  }

  init() {
    this.app.get('/api/business-partners/:businessPartnerId/visibility', (req, res) => this.show(req, res));
    this.app.put('/api/business-partners/:businessPartnerId/visibility', (req, res) => this.createOrUpdate(req, res));
  }

  async show(req, res) {
    const businessPartnerId = req.params.businessPartnerId;
    const visibility = await this.api.find(businessPartnerId);
    if (!visibility) return handleNotExistError(res, businessPartnerId, req.opuscapita.logger);

    return res.json(visibility);
  }

  createOrUpdate(req, res) {
    return this.api.createOrUpdate(req.params.businessPartnerId, req.body).then(visibility => res.json(visibility)).
      catch(error => {
        req.opuscapita.logger.error('Error when updating BusinessPartnerVisibility: %s', error.message);
        return res.status('400').json({ message : error.message });
      });
  }
};

let handleNotExistError = function(response, businessPartnerId, logger) {
  const message = 'A BusinessPartnerVisibility with businessPartnerId ' + businessPartnerId + ' does not exist.'
  logger.error('Error when getting BusinessPartnerVisibility: %s', message);
  return response.status('404').json({ message : message });
};

module.exports = BusinessPartnerVisibility;
