const path = require('path');

module.exports.init = function(app)
{
  app.get('/static/components/:name', (req, res, next) => getFile(req, res, next));
};

let getFile = function(req, res, next) {
  const options = {
    root: path.resolve(__dirname, '../static/components'),
    dotfiles: 'deny',
    headers: {
      'x-timestamp': Date.now(),
      'x-sent': true
    }
  };

  const fileName = determineFileName(req.params.name);
  res.sendFile(fileName, options, function (err) {
    if (err) {
      next(err);
    } else {
      console.log('Sent:', fileName);
    }
  });
};

let determineFileName = function(name) {
  if (name === 'information-bundle.js') return 'supplier-information-bundle.js';
  if (name === 'registration-bundle.js') return 'supplier-registration-bundle.js';
  if (name === 'creation-bundle.js') return 'business-partner-creator-bundle.js';
  if (name === 'organization-bundle.js') return 'business-partner-organization-bundle.js';
  if (name === 'profile_strength-bundle.js') return 'business-partner-profile-strength-bundle.js';
  if (name === 'bank_accounts-bundle.js') return 'business-partner-bank-account-bundle.js';
  if (['address-bundle.js', 'addresses-bundle.js'].includes(name)) return 'business-partner-address-bundle.js';
  if (['contact-bundle.js', 'contacts-bundle.js'].includes(name)) return 'business-partner-contact-bundle.js';
  if (name === 'autocomplete-bundle.js') return 'business-partner-autocomplete-bundle.js';
  if (name === 'list-bundle.js') return 'business-partner-list-bundle.js';
  if (name === 'directory-bundle.js') return 'supplier-directory-bundle.js';
  if (name === 'access_approval-bundle.js') return 'supplier-access_approval-bundle.js';
  if (name === 'visibility-bundle.js') return 'supplier-visibility-bundle.js';
  if (name === 'overview-bundle.js') return 'business-link-overview-bundle.js';
  if (name === 'widget-bundle.js') return 'business-link-widget-bundle.js';
  if (name === 'connections-bundle.js') return 'business-link-connections-bundle.js';
  if (name === 'businessLinks-bundle.js') return 'business-link-businessLinks-bundle.js';
  if (name === 'editor-bundle.js') return 'business-link-editor-bundle.js';

  return name;
};
