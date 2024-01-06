import { NextResponse } from "next/server";

import * as jwt from "jsonwebtoken";

import sheetConfig from "@/configs/googleSheet";
import globalConfig from "@/configs/global";
import SheetAPI from "@/libs/SheetAPI";
import SheetDataTool from "@/libs/SheetDataTool";

export async function POST(request) {
  try {
    const reqBody = await request.json();

    const response = await SheetAPI().spreadsheets.values.get({
      spreadsheetId: sheetConfig.sheet.id,
      range: `${sheetConfig.sheet.authTable.name}!${sheetConfig.sheet.authTable.range}`,
    });
    const rows = response.data.values;

    const sheetObj = new SheetDataTool(rows, true);
    const userData = sheetObj.generateObject().findOne(reqBody);
    if (userData) {
      const token = jwt.sign(
        { username: userData.username },
        globalConfig.secret,
        {
          algorithm: "RS512",
          expiresIn: "24h",
        },
      );
      const result = {
        username: userData.username,
        token,
        redirect: "/machines",
      };

      return NextResponse.json({ result }, { status: 200 });
    }
    return NextResponse.json({ message: "user not found" }, { status: 404 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(error, { status: 500 });
  }
}
