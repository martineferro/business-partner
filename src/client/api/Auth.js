import ApiBase from './ApiBase';

class Auth extends ApiBase {
  refreshIdToken() {
    return this.ajax.post('/refreshIdToken').set('Content-Type', 'application/json').then(res => res && res.body);
  }
}

export default Auth;
