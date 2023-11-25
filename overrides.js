const fs = require("fs");
const { parse } = require("csv-parse/sync");
const { stringify } = require("csv-stringify/sync");

process.stdout.write("reading tsv... ");
const tsvContent = fs.readFileSync("ccd.tsv");
const records = parse(tsvContent, {
  delimiter: "\t",
  columns: true,
  bom: true,
});
process.stdout.write("done\n");

// console.log(records[0]);
/*
{
  Component: '一',
  Strokes: '1',
  CompositionType: '一',
  LeftComponent: '一',
  LeftStrokes: '1',
  RightComponent: '*',
  RightStrokes: '0',
  Signature: 'M',
  Notes: '/',
  Section: '*'
}
*/

process.stdout.write("editing... ");
const troublesome = records.filter(
  (r) =>
    r.CompositionType == "咒" ||
    r.CompositionType == "弼" ||
    r.CompositionType == "冖"
);
for (const r of troublesome) {
  switch (r.CompositionType) {
    case "咒":
      r.LeftComponent += r.LeftComponent;
      break;
    case "弼":
      r.RightComponent += r.LeftComponent;
      break;
    case "冖":
      r.LeftComponent += "冖";
      break;
  }
}
const reduced = troublesome.map(
  ({ Component, Strokes, LeftComponent, RightComponent }) => ({
    Component,
    Strokes,
    LeftComponent,
    RightComponent,
  })
);
process.stdout.write("done\n");

process.stdout.write("outputting to file... ");
const outStr = stringify(reduced, { header: true });
fs.writeFileSync("trouble.csv", outStr);
process.stdout.write("done\n");
