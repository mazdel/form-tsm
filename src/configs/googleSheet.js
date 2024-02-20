const sheetConfig = {
  sheet: {
    id: "1yZuCy_Rtwn9A5bkrVOestZj6myujIm_S1p_ekNN0qwA",
    name: "",
    authTable: { name: "_user", range: "A:B" },
    showTabs: [
      {
        name: "FORM",
        listRange: ["B", "D", "F", "H"],
        groupBy: "D",
        highlights: ["B"],
        edit: {
          ranges: ["B", "A", "C", "E", "F", "G", "H", "M"],
          rules: [
            { column: "F", spec: "input", type: "number", min: "E" },
            { column: "H", spec: "input", type: "number", min: "G" },
            { column: "M", spec: "input", type: "text" },
            { column: "B", spec: "heading", type: "h2" },
            { column: "A", spec: "heading", type: "h3" },
          ],
        },
      },
    ],
  },
};

export default sheetConfig;
