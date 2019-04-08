const BusinessPartnerApi = require('../api/BusinessPartner');
const BusinessPartner2UserApi = require('../api/BusinessPartner2User');
const notification = require('../services/notification');
const User = require('../services/User');
const UserData = require('../services/UserData');

class BusinessPartnerAccess {
  constructor(app, db) {
    this.app = app;
    this.businessPartnerApi = new BusinessPartnerApi(db);
    this.bp2UserApi = new BusinessPartner2UserApi(db);
  }

  init() {
    this.app.post('/api/supplier_access', (req, res) => this.create(req, res));
    this.app.post('/api/business-partner-access', (req, res) => this.create(req, res));

    this.app.get('/api/supplier_access', (req, res) => this.index(req, res));
    this.app.get('/api/business-partner-access', (req, res) => this.index(req, res));

    this.app.put('/api/supplier_access/:id', (req, res) => this.update(req, res));
    this.app.put('/api/business-partner-access/:id', (req, res) => this.update(req, res));

    this.app.get('/api/supplier_access/:userId', (req, res) => this.show(req, res));
    this.app.get('/api/business-partner-access/:userId', (req, res) => this.show(req, res));

    this.app.put('/api/grant_supplier_access', (req, res) => this.addToUser(req, res));
    this.app.put('/api/grant-business-partner-access', (req, res) => this.addToUser(req, res));
  }

  async index(req, res) {
    const bpId = req.query.businessPartnerId;
    if (!bpId) return res.status('400').json({ message: 'businessPartnerId query parameter must be given' });

    const businessPartner2users = await this.bp2UserApi.all(bpId);
    if (req.query.include !== 'user') return res.json(businessPartner2users);

    const userIds = businessPartner2users.map(businessPartner2user => businessPartner2user.userId);
    const userService = new User(req.opuscapita.serviceClient);
    const users = await userService.allForUserIds(userIds);

    const businessPartner2usersWithUsers = businessPartner2users.map(businessPartner2user => {
      let data = businessPartner2user.dataValues;
      const user = users.find(us => us.id === data.userId);
      data.user = user ? user.profile : {};
      return data;
    });

    return res.json(businessPartner2usersWithUsers);
  }

  async show(req, res) {
    const bp2user = await this.bp2UserApi.find(req.params.userId);
    if (!bp2user) return res.status('404').json({ message: 'BusinessPartner2User not found' });

    return res.json(bp2user);
  }

  async create(req, res) {
    const attributes = req.body;
    const businessPartner2user = await this.bp2UserApi.find(attributes.userId);

    if (businessPartner2user) return res.status('200').json(businessPartner2user);

    let userData = new UserData(req);
    attributes.status = 'requested';
    attributes.createdBy = userData.id;
    return this.bp2UserApi.create(attributes).then(async bp2user => {
      const userService = new User(req.opuscapita.serviceClient);
      const requestUser = await userService.getProfile(bp2user.userId);
      const businessPartner = await this.businessPartnerApi.find(bp2user.businessPartnerId);

      return userService.allForSupplierId(bp2user.businessPartnerId).then(users => {
        const userIds = users.reduce((arr, user) => {
          if (user.roles.includes('supplier-admin')) arr.push(user.id);
          return arr;
        }, []);

        return notification.accessRequest({ serviceClient, businessPartner, requestUser, userIds, req }).then(() => res.status('201').json(bp2user)).
          catch(error => {
            req.opuscapita.logger.warn('Error when sending email: %s', error.message);
            bp2user.warning = error.message;
            return res.status('201').json(bp2user);
          });
      });
    }).catch(error => {
      req.opuscapita.logger.error('Error when creating BusinessPartner2User: %s', error.message);

      return res.status('400').json({ message : error.message });
    });
  }

  async update(req, res) {
    const businessPartner2userId = req.params.id;

    return this.bp2UserApi.exists(businessPartner2userId).then(exists => {
      if (!exists) {
        const message = 'No BusinessPartner2User with Id ' + businessPartner2userId + ' exists.'
        req.opuscapita.logger.error('Error when updating BusinessPartner2User: %s', message);
        return res.status('404').json({ message : message });
      }

      const access = req.body;
      return this.bp2UserApi.update(businessPartner2userId, access).then(async bp2user => {
        if (bp2user.status === 'requested') return res.json(bp2user);

        const serviceClient = req.opuscapita.serviceClient;
        const userIds = [bp2user.userId];
        const businessPartner = await this.businessPartnerApi.find(bp2user.businessPartnerId);
        let notificationPromise;
        if (bp2user.status === 'approved') notificationPromise = notification.accessApproval({ serviceClient, businessPartner, userIds, req });
        if (bp2user.status === 'rejected') notificationPromise = notification.accessRejection({ serviceClient, businessPartner, userIds, req });

        return notificationPromise.then(() => res.json(bp2user)).catch(error => {
          req.opuscapita.logger.warn('Error when sending email: %s', error.message);
          bp2user.warning = error.message;
          return res.json(bp2user);
        });
      });
    }).catch(error => {
      req.opuscapita.logger.error('Error when updating BusinessPartner2User: %s', error.message);
      return res.status('400').json({ message : error.message });
    });
  }

  addToUser(req, res) {
    const businessPartnerId = req.body.businessPartnerId;

    return this.businessPartnerApi.exists(businessPartnerId).then(exists => {
      if (!exists) {
        const message = 'A business partner with ID ' + businessPartnerId + ' does not exist.';
        req.opuscapita.logger.error('Error when adding BusinessPartner to User: %s', message);
        return res.status('404').json({ message : message });
      }

      const user = { businessPartnerId: businessPartnerId, roles: ['supplier'] };
      const userService = new User(req.opuscapita.serviceClient);

      return userService.update(req.body.userId, user).then(() => {
        return res.status('200').json({ message: 'BusinessPartner successfully added to user' });
      }).catch(error => {
        req.opuscapita.logger.error('Error when adding BusinessPartner to User: %s', error.message);
        return res.status((error.response && error.response.statusCode) || 400).json({ message : error.message });
      });
    }).catch(error => {
      req.opuscapita.logger.error('Error when adding BusinessPartner to User: %s', error.message);
      return res.status('400').json({ message : error.message });
    });
  }
};

module.exports = BusinessPartnerAccess;
