'use strict';

const toSnakeCase = name => {
  const upperChars = name.match(/([A-Z])/g);
  if (!upperChars) {
    return name;
  }

  let str = name.toString();
  for (let i = 0, n = upperChars.length; i < n; i++) {
    str = str.replace(new RegExp(upperChars[i]), '_' + upperChars[i].toLowerCase());
  }

  if (str.slice(0, 1) === '_') {
    str = str.slice(1);
  }

  return str + 's';
};

module.exports = { toSnakeCase };
