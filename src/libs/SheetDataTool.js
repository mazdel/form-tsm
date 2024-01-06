/**
 * Sheet 2D Array to Object Handler
 * @class
 * @classdesc A simple tool to handle spreadsheet data as Object
 * @param {array[]} sheetData - the 2D Array of sheet data
 * @param {boolean} [firstRowAsHeader] - Treat the first row as header, default to true
 *
 * @method generateObject
 * @memberof SheetDataTool
 * @instance
 * @summary Generate sheet data as an Object
 * @returns {Object} an Object type data of the sheet
 */
class SheetDataTool {
  /**
   * @constructor
   * @param {array[]} sheetData - the 2D Array of sheet data
   * @param {boolean} [firstRowAsHeader] - Treat the first row as header, default to true
   */
  constructor(sheetData, firstRowAsHeader = true) {
    this.sheetData = sheetData;
    this.firstRowAsHeader = firstRowAsHeader;
  }

  #generateHeaders(sheetData) {
    let headers;
    if (this.firstRowAsHeader) {
      headers = sheetData.splice(0, 1)[0];
    } else {
      const longestRow = sheetData.reduce((prevVal, currVal) => {
        return prevVal.length >= currVal.length ? prevVal : currVal;
      }, []);
      headers = longestRow.map((val, index) =>
        String.fromCharCode(97 + index).toUpperCase(),
      );
    }
    return [headers, sheetData];
  }

  /**
   * Generate sheet data as an Object
   * @method
   * @instance
   * @returns {SheetDataTool} an Array of Object type data of the sheet
   */
  generateObject() {
    const [headers, sheetData] = this.#generateHeaders(this.sheetData);

    const generatedArrayOfObject = sheetData.map((row) => {
      return headers.reduce(
        (prevVal, currVal, currIndex) => ({
          ...prevVal,
          [currVal]: row[currIndex],
        }),
        {},
      );
    });
    this.generatedArrayOfObject = generatedArrayOfObject;
    return this;
  }
  /**
   * Get the generated Object
   * @method
   * @instance
   * @returns {object[]}
   */
  get() {
    return this.generatedArrayOfObject;
  }
  /**
   * Find all the given object within generatedObject data
   * @method
   * @instance
   * @param {Object} searchObject key - value based object to search
   * @param {boolean} [strict=true] If strict, all the result should match to the searchObject argument
   * @returns {object[]}
   */
  findAll(searchObject, strict = true) {
    return this.generatedArrayOfObject.filter((obj) => {
      return Object.entries(searchObject).reduce((prevVal, [key, value]) => {
        if (strict) return prevVal && obj[key] === value;

        return prevVal || obj[key] === value;
      }, strict);
    });
  }
  /**
   * Find first appearance of the given object within generatedObject data
   * @method
   * @instance
   * @param {Object} searchObject key - value based object to search
   * @param {boolean} [strict=true] If strict, all the result should match to the searchObject argument
   * @returns {Object}
   */
  findOne(searchObject, strict = true) {
    return this.findAll(searchObject, strict)[0];
  }
}

export default SheetDataTool;
