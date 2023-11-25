const fs = require("fs");
const fullTable = require("./table2_fix.json");
const verifiedTable = require("./table_fix.json");

const full = process.argv[2]?.toUpperCase() == "TRUE" || false;
console.log(full ? "writing complete decoder" : "writing verified decoder");

console.log("writing table...");
const table = full ? fullTable : verifiedTable;
const invTable = {};
const collisions = {};
for (const [key, value] of Object.entries(table).sort(
  (a, b) => b[1].length - a[1].length
)) {
  if (invTable[value]) {
    // console.log(
    //   `COLLISION DETECTED: ${key} and ${invTable[value]} both map to ${value}. Using old value`
    // );
    if (collisions[value]) {
      collisions[value].add(key);
    } else {
      collisions[value] = new Set([invTable[value], key]);
    }
  } else invTable[value] = key;
}

for (const key of Object.keys(collisions)) {
  collisions[key] = Array.from(collisions[key]);
}
const numColls = Object.keys(collisions).length;
console.log(`done (${numColls} collisions)`);
if (numColls) {
  console.log(collisions);

  const collisionsFile = full ? "collisions2.json" : "collisions.json";
  fs.writeFileSync(collisionsFile, JSON.stringify(collisions, null, 2));
  console.log(`wrote all ${numColls} collisions to ${collisionsFile}`);
}

process.stdout.write("saving to file... ");
fs.writeFileSync(
  full ? "decoder2.json" : "decoder.json",
  JSON.stringify(invTable, null, 2)
);
process.stdout.write("done!\n");
