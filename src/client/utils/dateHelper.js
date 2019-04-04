module.exports.format = function(dateString, locale) {
  return (new Date(dateString)).toLocaleDateString(locale);
};
