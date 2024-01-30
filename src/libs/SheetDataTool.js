import { letterToNumber } from "@/utils/letterToNumber";

/**
 * Sheet 2D Array to Object Handler
 * @class
 * @classdesc A simple tool to handle spreadsheet data as Object
 * @param {Object} sheetData - The Sheet data Object
 * @param {boolean} [firstRowAsHeader=true] - Treat the first row of values as header, default to true
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
   * @param {Object} sheetData - The Sheet data Object
   * @param {boolean} [firstRowAsHeader=true] - Treat the first row of values as header, default to true
   */
  constructor(sheetData, firstRowAsHeader = true) {
    const { values, ...sheetMetadata } = sheetData;
    this.sheetValues = values;
    this.metadata = sheetMetadata;
    this.firstRowAsHeader = firstRowAsHeader;
    this.generatedArrayOfObject = [];
  }

  /**
   * Generate object keys from values header
   * @param {Array[]} sheetValues Sheet values
   * @returns {Array[]}
   */
  #generateHeaders(sheetValues) {
    let headers, bodyData;
    if (this.firstRowAsHeader) {
      [headers, ...bodyData] = sheetValues;
    } else {
      const longestRow = sheetValues.reduce((prevVal, currVal) => {
        return prevVal.length >= currVal.length ? prevVal : currVal;
      }, []);
      headers = longestRow.map((val, index) =>
        String.fromCharCode(97 + index).toUpperCase(),
      );
    }
    return [headers, bodyData];
  }
  /**
   * Generate metadata
   * @returns {Object} {[title]: columnsLetter} formatted object result
   */
  #generateMetadata() {
    const [headers] = this.#generateHeaders(this.sheetValues);
    const columnsRange = this.metadata.range.split("!")[1].split(":");
    const firstColumn = columnsRange[0].replace(/\d/gim, "");
    const lastColumn = columnsRange[1].replace(/\d/gim, "");

    let colNum = letterToNumber(firstColumn);
    let columns = [];

    while (colNum <= letterToNumber(lastColumn)) {
      const colLetter = String.fromCharCode(96 + colNum).toUpperCase();
      columns = [...columns, colLetter];
      colNum += 1;
    }
    return headers.reduce(
      (prevVal, currVal, currIndex) => {
        return { ...prevVal, [currVal]: columns[currIndex] };
      },
      { rowId: 0 },
    );
  }

  /**
   * Generate sheet data as an Array of Objects
   * @method
   * @instance
   * @returns {SheetDataTool} SheetDataTool Instance
   */
  generateObject() {
    const [headers, sheetValues] = this.#generateHeaders(this.sheetValues);

    const generatedArrayOfObject = sheetValues.map((row, rowId) => {
      return headers.reduce(
        (prevVal, currVal, currIndex) => ({
          ...prevVal,
          [currVal]: row[currIndex] ?? "",
        }),
        { rowId: rowId + 1 },
      );
    });
    this.generatedArrayOfObject = [
      ...this.generatedArrayOfObject,
      ...generatedArrayOfObject,
    ];
    return this;
  }
  /**
   * Insert the sheet metadata to the Array of Objects
   * @method
   * @instance
   * @returns {SheetDataTool} SheetDataTool Instance
   */
  insertMetadata() {
    const metadata = this.#generateMetadata();
    const keys = Object.keys(this.generatedArrayOfObject[0]);
    const result = Object.entries(metadata).reduce((prevVal, [key, value]) => {
      if (keys.includes(key)) {
        return { ...prevVal, [key]: value };
      }
      return prevVal;
    }, {});
    this.generatedArrayOfObject = [result, ...this.generatedArrayOfObject];
    return this;
  }
  /**
   * Get the sheet metadata
   * @returns {Object}
   */
  #getMetadata() {
    return this.#generateMetadata();
  }
  /**
   * Select columns
   * @method
   * @instance
   * @param {string[]} columns Array of columns letter
   * @returns {SheetDataTool} SheetDataTool Instance
   */
  select(columns) {
    const metadata = this.#getMetadata();
    const selected = [
      "rowId",
      ...columns.map((column) => {
        let objectValueId = Object.values(metadata).findIndex(
          (value) => value === column,
        );
        return Object.keys(metadata)[objectValueId];
      }),
    ];
    const result = this.generatedArrayOfObject.map((objectData) => {
      const objResult = Object.entries(objectData).reduce(
        (prevVal, [key, value]) => {
          if (selected.includes(key)) {
            return { ...prevVal, [key]: value };
          }
          return prevVal;
        },
        {},
      );
      return objResult;
    });
    this.generatedArrayOfObject = result;
    return this;
  }

  /**
   * Get the generated Object
   * @method
   * @instance
   * @returns {object[]} an Array of Object type data of the sheet
   */
  get() {
    return this.generatedArrayOfObject;
  }

  /**
   * Get the generated Object
   * @returns {object[]} an Array of Object type data of the sheet
   */
  get object() {
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
