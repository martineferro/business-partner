import ApiBase from './ApiBase';

class Access extends ApiBase {
  getAccesses(supplierId) {
    return this.ajax.get(`/supplier/api/supplier_access?supplierId=${supplierId}&include=user`).
    set('Accept', 'application/json').then(response => {
      return response.body.map(accessRequest => {
        return {
          id: accessRequest.id,
          userId: accessRequest.userId,
          firstName: accessRequest.user.firstName,
          lastName: accessRequest.user.lastName,
          email: accessRequest.user.email,
          date: accessRequest.createdOn,
          comment: accessRequest.accessReason,
          status: accessRequest.status
        };
      })
    });
  }

  getAccess(userId) {
    return this.ajax.get(`/supplier/api/supplier_access/${userId}`).set('Accept', 'application/json').
      then(response => response.body);
  }

  createAccess(access) {
    return this.ajax.post('/supplier/api/supplier_access').set('Accept', 'application/json').
      send(access).then(response => response.body);
  }

  approveAccess(id, userId) {
    return this.ajax.put(`/supplier/api/supplier_access/${id}`).set('Accept', 'application/json').
      send({ userId: userId, status: 'approved' }).then(response => response.body);
  }

  rejectAccess(id, userId) {
    return this.ajax.put(`/supplier/api/supplier_access/${id}`).set('Accept', 'application/json').
      send({ userId: userId, status: 'rejected' }).then(response => response.body);
  }

  grantAccess(access) {
    return this.ajax.put('/supplier/api/grant_supplier_access').set('Accept', 'application/json').
      send(access).then(response => response.body);
  }
}

export default Access;
