const assert = require('assert');
const superagent = require('superagent');
const config = require('@opuscapita/config');
const init = require('../../src/server/main');

const waitForService = serviceName => config.getEndPoint(serviceName).catch(e => waitForService(serviceName));

return;

describe('Server', () =>
{
  let url;
  let authToken;

  before('Init', async () =>
  {
    await config.init();
    await init({ db: { sequelize: { logging: false } } });

    await config.waitForEndpoints([
      'mysql',
      'consul',
      'kong',
      'redis',
      'rabbitmq-amqp',
      'acl',
      'auth',
      'user'
    ]);

    const kong = await waitForService('kong');
    url = `http://${kong.host}:8080`;

    const { CLIENT_KEY, CLIENT_SECRET, TEST_USER, TEST_PASSWORD } = process.env;
    const secret = new Buffer(`${CLIENT_KEY}:${CLIENT_SECRET}`).toString('base64');
    const auth = await waitForService('auth');
    const authUrl = `${url}/auth/token`;

    const result = await superagent.post(authUrl).set('Authorization', `Basic ${secret}`)
      .send(`grant_type=password&username=${TEST_USER}&password=${TEST_PASSWORD}&scope=email,userInfo,roles`)
      .then(res => res.body);

    authToken = `${result.token_type} ${result.access_token}`;
  });

  it('Gets business partners', async () =>
  {
    const result = await superagent.get(`${url}/business-partner/api/business-partners`).
      set('Authorization', authToken).
      then(res => res.body);

    assert.deepEqual(result.length, 1);
  });
});
