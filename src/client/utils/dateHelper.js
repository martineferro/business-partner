module.exports.format = function(dateString, locale)
{
  return (new Date(dateString)).toLocaleDateString(locale);
};

module.exports.sort = function(a, b)
{
  return new Date(a) - new Date(b);
};
