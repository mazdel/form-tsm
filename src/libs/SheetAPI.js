import * as sheets from "@googleapis/sheets";

const SheetAPI = () => {
  try {
    const scopes = ["https://www.googleapis.com/auth/spreadsheets"];
    const jwt = new sheets.auth.JWT(
      process.env.GOOGLE_SHEETS_SERVICE_EMAIL,
      null,
      (process.env.GOOGLE_SHEETS_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
      scopes,
    );

    return sheets.sheets({ version: "v4", auth: jwt });
  } catch (error) {
    console.log(error);
  }
};

export default SheetAPI;
