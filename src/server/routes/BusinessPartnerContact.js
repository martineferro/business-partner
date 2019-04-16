const BusinessPartnerContactApi = require('../api/BusinessPartnerContact');
const UserData = require('../services/UserData');
const User = require('../services/User');
const authService = require('../services/auth');

class BusinessPartnerContact {
  constructor(app, db) {
    this.app = app;
    this.api = new BusinessPartnerContactApi(db);
  }

  init() {
    this.app.get('/api/suppliers/:businessPartnerId/contacts', (req, res) => this.index(req, res));
    this.app.get('/api/customers/:businessPartnerId/contacts', (req, res) => this.index(req, res));
    this.app.get('/api/business-partners/:businessPartnerId/contacts', (req, res) => this.index(req, res));

    this.app.post('/api/suppliers/:businessPartnerId/contacts', (req, res) => this.create(req, res));
    this.app.post('/api/customers/:businessPartnerId/contacts', (req, res) => this.create(req, res));
    this.app.post('/api/business-partners/:businessPartnerId/contacts', (req, res) => this.create(req, res));

    this.app.post('/api/suppliers/:businessPartnerId/contacts/createUser', (req, res) => this.createUser(req, res));
    this.app.post('/api/customers/:businessPartnerId/contacts/createUser', (req, res) => this.createUser(req, res));
    this.app.post('/api/business-partners/:businessPartnerId/contacts/createUser', (req, res) => this.createUser(req, res));

    this.app.get('/api/suppliers/:businessPartnerId/contacts/:contactId', (req, res) => this.show(req, res));
    this.app.get('/api/customers/:businessPartnerId/contacts/:contactId', (req, res) => this.show(req, res));
    this.app.get('/api/business-partners/:businessPartnerId/contacts/:contactId', (req, res) => this.show(req, res));

    this.app.put('/api/suppliers/:businessPartnerId/contacts/:contactId', (req, res) => this.update(req, res));
    this.app.put('/api/customers/:businessPartnerId/contacts/:contactId', (req, res) => this.update(req, res));
    this.app.put('/api/business-partners/:businessPartnerId/contacts/:contactId', (req, res) => this.update(req, res));

    this.app.delete('/api/suppliers/:businessPartnerId/contacts/:contactId', (req, res) => this.delete(req, res));
    this.app.delete('/api/customers/:businessPartnerId/contacts/:contactId', (req, res) => this.delete(req, res));
    this.app.delete('/api/business-partners/:businessPartnerId/contacts/:contactId', (req, res) => this.delete(req, res));
  }

  index(req, res) {
    return this.api.all(req.params.businessPartnerId).then(contacts => res.json(contacts));
  }

  show(req, res) {
    return this.api.find(req.params.businessPartnerId, req.params.contactId).then(contact => {
      if (!contact) return res.status('404').json({ message: 'Contact not found' });

      return res.json(contact);
    });
  }

  create(req, res) {
    const userData = new UserData(req);
    req.body.businessPartnerId = req.params.businessPartnerId;
    req.body.createdBy = userData.id;
    req.body.changedBy = userData.id;

    return this.api.create(req.body).then(contact => res.status('201').json(contact))
    .catch(error => {
      req.opuscapita.logger.error('Error when creating BusinessPartnerContact: %s', error.message);
      return res.status('400').json({ message : error.message });
    });
  }

  update(req, res) {
    const contactId = decodeURIComponent(req.params.contactId);
    const businessPartnerId = req.params.businessPartnerId;
    return this.api.exists(businessPartnerId, contactId).then(exists => {
      if(!exists) return handleContactNotExistError(res, contactId, req.opuscapita.logger);

      req.body.changedBy = new UserData(req).id;
      return this.updateAndRender(businessPartnerId, contactId, req.body, res);
    })
    .catch(error => {
      req.opuscapita.logger.error('Error when updating BusinessPartnerContact: %s', error.message);
      return res.status('400').json({ message : error.message });
    });
  }

  createUser(req, res) {
    const contact = req.body;
    return this.api.exists(req.params.businessPartnerId, contact.id).then(exists => {
      if (!exists) return handleContactNotExistError(res, contact.id, req.opuscapita.logger);

      const userService = new User(req.opuscapita.serviceClient);
      return userService.get(contact.email).then(() => {
        return res.status('409').json({ message : 'User already exists' });
      }).catch(error => {
        if (error.response && error.response.statusCode == '404') {
          const user = {
            id: contact.email,
            acceptedConditions: null,
            status: 'emailVerification',
            businessPartnerId: contact.businessPartnerId,
            roles: ['supplier'],
            profile: { firstName: contact.firstName, lastName: contact.lastName, email: contact.email }
          };
          return authService.createUser(req.opuscapita.serviceClient, user).then(() => {
            return this.updateAndRender(contact.businessPartnerId, contact.id, { isLinkedToUser: true }, res);
          });
        } else {
          req.opuscapita.logger.error('Error when creating user from BusinessPartnerContact: %s', error.message);
          return res.status('400').json({ message : error.message });
        }
      });
    });
  }

  delete(req, res) {
    const contactId = decodeURIComponent(req.params.contactId);
    return this.api.delete(req.params.businessPartnerId, contactId).then(() => res.json(null))
    .catch(error => {
      req.opuscapita.logger.error('Error when deleting BusinessPartnerContact: %s', error.message);
      return res.status('400').json({ message : error.message });
    });
  }

  updateAndRender(businessPartnerId, contactId, attributes, response) {
    return this.api.update(businessPartnerId, contactId, attributes).then(contact => response.json(contact));
  }
};

let handleContactNotExistError = function(response, contactId, logger) {
  const message = 'A business partner contact with ID ' + contactId + ' does not exist.'
  logger.error('Error when updating BusinessPartnerContact: %s', message);
  return response.status('404').json({ message : message });
};

module.exports = BusinessPartnerContact;
