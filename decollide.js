const fs = require("fs");
// const opencc = require("node-opencc");
const fullTable = require("./table2.json");
const veriTable = require("./table.json");
const fullCollisions = require("./collisions2.json");
const veriCollisions = require("./collisions.json");
// const { setInterval, clearInterval } = require("timers");

const full = process.argv[2]?.toUpperCase() == "TRUE" || false;
console.log(full ? "fixing complete table" : "fixing verified table");
const table = full ? fullTable : veriTable;
const collisions = full ? fullCollisions : veriCollisions;

// const filtered = [];
// let removed = 0;
// let idx = 0;

// const timer = setInterval(() => console.log("idx:", idx), 1000);
// for (const [key, collision] of Object.entries(collisions)) {
//   const toComp = opencc.simplifiedToTraditional(collision[0]);

//   let allEqual = true;
//   for (let i = 1; i < collision.length; i++) {
//     if (toComp !== opencc.simplifiedToTraditional(collision[i]))
//       allEqual = false;
//   }

//   if (!allEqual) filtered.push([key, collision]);
//   else removed++;

//   idx++;
// }
// clearInterval(timer);

// console.log(`kept ${filtered.length}; removed ${removed}`);

process.stdout.write("editing... ");
for (const collision of Object.values(collisions)) {
  for (let i = 0; i < collision.length; i++) {
    // add "A", then "B", "C", ...
    table[collision[i]] += String.fromCharCode(65 + i);
  }
}
process.stdout.write("done\n");

process.stdout.write("writing to file... ");
fs.writeFileSync(
  full ? "table2_fix.json" : "table_fix.json",
  JSON.stringify(table, null, 2)
);
process.stdout.write("done\n");
