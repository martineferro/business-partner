class User {
  constructor(serviceClient) {
    this.serviceClient = serviceClient;
  }

  allForSupplierId(supplierId) {
    return this.serviceClient.get('user', `/api/users?supplierId=${supplierId}&include=profile`, true).spread(users => users);
  }

  allForUserIds (userIds) {
    return this.serviceClient.get('user', `/api/users?ids=${userIds.join(',')}&include=profile`, true).spread(users => users);
  }

  getProfile(userId) {
    return this.serviceClient.get('user', `/api/users/${userId}/profile`, true).spread(profile => profile);
  }

  get(userId) {
    return this.serviceClient.get('user', `/api/users/${userId}`, true).spread(user => user);
  }

  update(userId, user) {
    return this.serviceClient.put('user', `/api/users/${userId}`, user, true);
  }

  removeRoleFromUser(userId, roleId) {
    return this.serviceClient.delete('user', `/api/users/${userId}/roles/${roleId}`, undefined, true);
  }
};

module.exports = User;
