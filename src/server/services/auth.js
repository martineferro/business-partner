module.exports.createUser = function(serviceClient, user) {
  return serviceClient.post('auth', '/api/registration/register', user, true);
}
