const { en, de } = require('../i18n');

module.exports.accessRequest = function({ serviceClient, businessPartner, requestUser, userIds, req }) {
  const link = getHostUrl(req) + '/bnp/supplierInformation?tab=accessApproval';
  const description = {
    firstName: requestUser.firstName,
    lastName: requestUser.lastName,
    email: requestUser.email,
    supplierName: businessPartner.name,
    link: link
  }

  return sendNotification(serviceClient, link, getTranslations('accessRequest', description), userIds);
};

module.exports.accessApproval = function({  serviceClient, businessPartner, userIds, req }) {
  const link = getHostUrl(req) + '/bnp/supplierRegistration';
  const description = { supplierName: businessPartner.name, link: link }

  return sendNotification(serviceClient, link, getTranslations('accessApproval', description), userIds);
};

module.exports.accessRejection = function({ serviceClient, businessPartner, userIds, req }) {
  const link = getHostUrl(req) + '/bnp/supplierRegistration';
  const description = { supplierName: businessPartner.name }

  return sendNotification(serviceClient, link, getTranslations('accessRejection', description), userIds);
};

let sendNotification = function(serviceClient, link, translations, users) {
  const deliveryMode = getDeliveryMode(users);
  const categoryId = 'supplier.user-access';

  const body = { translations, link, categoryId, users, deliveryMode };
  return serviceClient.post('notification', `/api/notifications`, body, true);
}

let getDeliveryMode = function(users) {
  if (users.length === 0) return ["notification"];

  return ["notification", "email"];
}

let getHostUrl = function(req) {
  const externalHost = req.get('X-Forwarded-Host') || req.get('Host');

  return req.protocol + '://' + externalHost;
};

let getTranslations = function(type, description) {
  return {
    en: {
      title: en[`notification.${type}.title`],
      description: replaceText(en[`notification.${type}.description`], description),
      isDefault: true
    },
    de: {
      title: de[`notification.${type}.title`],
      description: replaceText(de[`notification.${type}.description`], description),
    }
  };
};

let replaceText = function(text, replaceObj)
{
  return Object.keys(replaceObj).reduce((txt, key) => txt.replace(`{${key}}`, replaceObj[key]), text);
}
