/**
 * Parse a string if its a number or return it as before
 * @param {any} str string or number to test
 * @returns {number|string}
 */

const parseIfInt = (str) => {
  const test = /^\+?\d+$/.test(str);
  if (test) {
    return parseInt(str);
  } else {
    return str;
  }
};

export { parseIfInt };
