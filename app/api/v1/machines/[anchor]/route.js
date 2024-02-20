import { decrypt } from "@/utils/encryption";
import { NextResponse } from "next/server";
import SheetAPI from "@/libs/SheetAPI";
import sheetConfig from "@/configs/googleSheet";
import { parseIfInt } from "@/utils/parseIfInt";
import SheetDataTool from "@/libs/SheetDataTool";

const spreadsheetId = sheetConfig.sheet.id;
export async function PATCH(request, { params }) {
  try {
    const decrypted = decrypt(params.anchor);
    if (!decrypted) throw { code: 404, message: "not found" };

    const { sheet, rowId } = JSON.parse(decrypted);
    const reqBody = await request.json();

    const bodyEntries = Object.entries(reqBody);
    const entries = await bodyEntries.reduce(async (entries, [key, value]) => {
      const range = `${sheet}!${key}${rowId + 1}`;
      const values = [[value]];
      const resource = { values };
      const result = await SheetAPI().spreadsheets.values.update({
        spreadsheetId,
        range,
        valueInputOption: "USER_ENTERED",
        resource,
      });
      const { status, config } = result;
      const updatedBody = JSON.parse(config.body);
      const updated = updatedBody.values[0][0];
      return {
        ...(await entries),
        [`${key}`]: { status, updated },
      };
    }, {});

    return NextResponse.json({ result: entries }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: error.code ?? 500 });
  }
}
export async function GET(request, { params }) {
  try {
    const decrypted = decrypt(params.anchor);
    if (!decrypted) throw { code: 404, message: "not found" };

    const { sheet, rowId } = JSON.parse(decrypted);
    const targetSheet = sheetConfig.sheet.showTabs.find(
      (obj) => obj.name === sheet,
    );

    const rangeSequence = targetSheet.edit.ranges.reduce(
      (sequences, col, index) => {
        return { ...sequences, [col]: { sequence: index, column: col } };
      },
      {},
    );

    const columns = targetSheet.edit.ranges.sort();
    const range = `${columns[0]}:${columns[columns.length - 1]}`;

    const response = await SheetAPI().spreadsheets.values.get({
      spreadsheetId: sheetConfig.sheet.id,
      range: `${targetSheet.name}!${range}`,
    });
    if (!response.data.values.length)
      throw { message: "sheet error", response };

    const rows = new SheetDataTool(response.data, true)
      .generateObject()
      .insertMetadata()
      .select(targetSheet.edit.ranges);

    const [header] = rows.get();

    const item = rows.findOne({ rowId: rowId });

    const rules = targetSheet.edit.rules
      .map((rule) => {
        let modRule = {};

        const [column] = Object.entries(header).find(
          ([, value]) => value == rule.column,
        );
        modRule = { ...modRule, column };

        if (rule.min) {
          let min = rule.min;
          if (typeof rule.min != "number") {
            const [minVal] = Object.entries(header).find(
              ([, value]) => value == rule.min,
            );
            min = parseIfInt(item[minVal]);
          }
          modRule = { ...modRule, min };
        }
        if (rule.max) {
          let max = rule.max;
          if (typeof rule.max != "number") {
            const [maxVal] = Object.entries(header).find(
              ([, value]) => value == rule.max,
            );
            max = parseIfInt(item[maxVal]);
          }
          modRule = { ...modRule, max };
        }
        return { ...rule, ...modRule };
      })
      .reduce((prevRule, rule) => {
        const { column, ...rest } = rule;
        return { ...prevRule, [column]: { ...rest } };
      }, {});

    const itemArray = Object.values(item);
    const fields = Object.entries(header).reduce(
      (prevVal, [key, value], indice) => {
        let fieldKey = key;
        if (key !== "rowId") {
          fieldKey = `${value}_${rangeSequence[value].sequence}`;
        }

        return {
          ...prevVal,
          [fieldKey]: {
            name: key,
            value: parseIfInt(itemArray[indice]),
            ...rules[key],
          },
        };
      },
      {},
    );
    const inputState = Object.entries(fields).reduce(
      (fieldObj, [key, value]) => {
        if (key === "rowId") return fieldObj;
        if (value.spec !== "input") return fieldObj;

        const [column] = key.split("_");
        return { ...fieldObj, [`${column}`]: value.value };
      },
      {},
    );

    return NextResponse.json(
      { result: { inputState, fields } },
      { status: 200 },
    );
    //
  } catch (error) {
    return NextResponse.json({ error: error }, { status: error.code ?? 500 });
  }
}
