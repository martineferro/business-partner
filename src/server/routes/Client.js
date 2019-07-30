const ClientApi = require('../api/Client');
const UserData = require('../services/UserData');

class Client {
  constructor(app, db) {
    this.app = app;
    this.api = new ClientApi(db);
  }

  init() {
    this.app.get('/api/clients', (req, res) => this.index(req, res));
    this.app.post('/api/clients', (req, res) => this.create(req, res));
    this.app.get('/api/clients/:id', (req, res) => this.show(req, res));
    this.app.put('/api/clients/:id', (req, res) => this.update(req, res));
    this.app.delete('/api/clients/:id', (req, res) => this.destroy(req, res));
  }

  index(req, res) {
    return this.api.all().then(clients => res.json(clients));
  }

  create(req, res) {
    const userData = new UserData(req);
    req.body.createdBy = userData.id;
    req.body.changedBy = userData.id;

    return this.api.create(req.body).then(client => res.status('201').json(client))
    .catch(error => {
      req.opuscapita.logger.error('Error when creating Client: %s', error.message);
      return res.status('400').json({ message : error.message });
    });
  }

  show(req, res) {
    return this.api.find(req.params.id).then(client => {
      if (!client) return res.status('404').json({ message: 'Not found' });

      return res.json(client);
    });
  }

  async update(req, res) {
    const client = await this.api.find(req.params.id);

    if (!client) return res.status('404').json({message: 'A client with this ID does not exist.'});

    req.body.changedBy = new UserData(req).id;
    return this.api.update(req.params.id, req.body).then(client => res.status('200').json(client))
    .catch(error => {
      req.opuscapita.logger.error('Error when updating Client: %s', error.message);
      res.status('400').json({message: error.message});
    });
  }

  destroy(req, res) {
    return this.api.delete(req.params.id).then(() => res.json(null))
      .catch(e => res.status('400').json({message: e.message}));
  }
}

module.exports = Client;
