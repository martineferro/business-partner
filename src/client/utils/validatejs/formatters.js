module.exports.groupedDetailed = function(validate) {
  return validate.formatters.groupedDetailed = function(errors) {
    let groups = {};
    for (const error of errors) {
      const attribute = error['attribute'];
      if (!groups[attribute]) groups[attribute] = [];

      groups[attribute].push({
        message: error.error,
        validator: error.validator,
        value: error.value,
        attributes: error.attributes
      });
    }

    return groups;
  };
};
