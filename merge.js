const fs = require("fs");
const { parse } = require("csv-parse/sync");
const { stringify } = require("csv-stringify/sync");

const full = process.argv[2]?.toUpperCase() == "TRUE" || false;
console.log(full ? "fixing complete table" : "fixing verified table");

process.stdout.write("reading fix csv... ");
const fixContent = fs.readFileSync("trouble.csv");
const fix = parse(fixContent, {
  columns: true,
  bom: true,
});
process.stdout.write("done\n");

const badFileName = full ? "ccd_lean" : "ccv_lean";
process.stdout.write(`reading ${badFileName}.csv... `);
const badContent = fs.readFileSync(badFileName + ".csv");
const bad = parse(badContent, {
  columns: true,
  bom: true,
});
process.stdout.write("done\n");

process.stdout.write("fixing... ");
for (const fixR of fix) {
  const badIdx = bad.findIndex((r) => fixR.Component == r.Component);
  if (badIdx !== -1) {
    // console.log(`fixed ${fixR.Component} (${JSON.stringify(fixR)})!`);
    bad[badIdx] = fixR;
  }
}
process.stdout.write("done\n");

// console.log(n
//   "駡:",
//   bad.find((r) => r.Component == "駡")
// );

// console.log(bad.filter((r) => r.Component === "駡"));

process.stdout.write("outputting to file... ");
const outStr = stringify(bad, { header: true });
fs.writeFileSync(badFileName + "_fix.csv", outStr);
process.stdout.write("done\n");
