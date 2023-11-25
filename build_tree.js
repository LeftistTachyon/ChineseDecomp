const fs = require("fs");
const { parse } = require("csv-parse/sync");

const full = process.argv[2]?.toUpperCase() == "TRUE" || false;
console.log(full ? "writing complete table" : "writing verified table");

process.stdout.write("reading csv... ");
const csvContent = fs.readFileSync(
  full ? "ccd_lean_fix.csv" : "ccv_lean_fix.csv"
);
const records = parse(csvContent, {
  columns: true,
  bom: true,
});
process.stdout.write("done\n");

process.stdout.write("tabluating records... ");
const table = {};
const notFound = new Set();
function getComponent(c) {
  if (c.Component == "*" || c.Component == "?") return ""; // special garbage case
  // already in table
  if (table[c.Component]) return table[c.Component];

  // if(c.Component == "𠮛") console.log("i wuz here");

  // itself or reduplication
  if (c.RightComponent == "*") {
    // itself
    if (c.LeftComponent == c.Component)
      return (table[c.Component] = c.Component);

    // reduplication
    let baseStr = "",
      len = 0;
    for (const ch of c.LeftComponent) {
      const baseComp = records.find((r) => r.Component == ch);
      if (!baseComp) {
        // console.log(`WARNING: could not find ${ch}`);
        notFound.add(ch);
        return (table[c.Component] = c.Component);
      }
      baseStr += getComponent(baseComp);
      len += baseComp.Strokes;
    }
    return (table[c.Component] = baseStr.repeat(c.Strokes / len));
  }

  // console.log(c, c.LeftComponent);
  if (c.Component == "駡") console.log(c);
  let output = "";
  for (const ch of c.LeftComponent + c.RightComponent) {
    if (ch == "*" || ch == "?") continue; // special garbage case
    // console.log(`digging for ${ch}`);
    const rec = records.find((r) => r.Component == ch);
    if (!rec) {
      // console.log(`couldn't find ${ch}`);
      notFound.add(ch);
      output += ch;
    } else output += getComponent(rec);
  }
  return (table[c.Component] = output.replaceAll(/\s/gm, ""));
}
for (const record of records) {
  // if(table[record.Component]) continue;
  // table[record.Component] = getComponent(record);
  getComponent(record);
}
process.stdout.write("done\n");

process.stdout.write(`characters not found:\n${Array.from(notFound)}\n`);

process.stdout.write("writing to file... ");
fs.writeFileSync(
  full ? "table2.json" : "table.json",
  JSON.stringify(table, null, 2)
);
process.stdout.write("done\n");
