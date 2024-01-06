/**
 * convert single letter to number
 * @param {string} letter A single letter
 * @returns {number}
 */
const letterToNumber = (letter) => {
  return letter.toString().toLocaleLowerCase().charCodeAt(0) - 96;
};

export { letterToNumber };
