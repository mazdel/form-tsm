import { NextResponse } from "next/server";
import sheetConfig from "@/configs/googleSheet";
import SheetAPI from "@/libs/SheetAPI";
import SheetDataTool from "@/libs/SheetDataTool";

export async function GET(request) {
  try {
    const targetSheet = sheetConfig.sheet.showTabs[0];

    const searchParams = request.nextUrl.searchParams;
    const getMetadata = searchParams.get("getMetadata");
    if (getMetadata) {
      const columns = [...targetSheet.highlights, targetSheet.groupBy].sort();
      const response = await SheetAPI().spreadsheets.values.get({
        spreadsheetId: sheetConfig.sheet.id,
        range: `${targetSheet.name}!${columns[0]}:${
          columns[columns.length - 1]
        }`,
      });

      if (response.data.values.length) {
        const rawData = response.data;
        const row = new SheetDataTool(rawData, true)
          .generateObject()
          .select([targetSheet.groupBy])
          .get();

        const groupBy = row.reduce(
          (prevVal, currVal) => {
            const currentArray = Object.entries(currVal)[1];
            return {
              ...prevVal,
              header: currentArray[0],
              groups: [...new Set([...prevVal.groups, currentArray[1]])],
            };
          },
          {
            column: targetSheet.groupBy,
            header: "",
            groups: [],
          },
        );
        const highlightsData = new SheetDataTool(rawData, true)
          .generateObject()
          .insertMetadata()
          .select(targetSheet.highlights)
          .get()[0];
        const highlights = Object.entries(highlightsData).reduce(
          (prevVal, [key, column]) => {
            if (targetSheet.highlights.includes(column)) {
              const seq = targetSheet.highlights.findIndex(
                (letter) => letter == column,
              );
              return [...prevVal, { seq, title: key, column }];
            }
            return prevVal;
          },
          [],
        );
        return NextResponse.json(
          { result: { groupBy, highlights } },
          { status: 200 },
        );
      }
      throw { message: "not found", status: 404 };
    }

    const column = targetSheet.listRange.sort();
    const listRange = `${column[0]}:${column[column.length - 1]}`;

    const response = await SheetAPI().spreadsheets.values.get({
      spreadsheetId: sheetConfig.sheet.id,
      range: `${targetSheet.name}!${listRange}`,
    });

    if (response.data.values.length) {
      const rows = new SheetDataTool(response.data, true)
        .generateObject()
        .select(targetSheet.listRange);
      const result = rows.get();

      return NextResponse.json(
        {
          result,
        },
        { status: 200 },
      );
    }
    return NextResponse.json(
      { error: { message: "not found" } },
      { status: 404 },
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error }, { status: error.status ?? 500 });
  }
}
