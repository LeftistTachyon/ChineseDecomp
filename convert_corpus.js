const fs = require("fs");
const readline = require("readline");
const {
  bertNormalizer,
  sequenceNormalizer,
  replace,
  stripNormalizer,
} = require("tokenizers");
const fullTable = require("./table2_fix.json");
const veriTable = require("./table_fix.json");

const full = process.argv[2]?.toUpperCase() == "TRUE" || false;
console.log(full ? "for complete table" : "for verified table");

process.stdout.write("preparing files... ");
const input = fs.createReadStream("baidubaike_corpus.txt", {
  encoding: "utf8",
  fd: null,
});
const inStream = readline.createInterface({
  input,
  crlfDelay: Infinity,
});
fs.unlinkSync("baiducorpus_conv.txt");
// const output = fs.createWriteStream("baiducorpus_conv.txt", {
//   encoding: "utf8",
//   fd: null,
// });
process.stdout.write("done\n");

process.stdout.write("making normalizer... ");
const table = full ? fullTable : veriTable;
const custNorm = sequenceNormalizer([
  bertNormalizer(),
  Object.entries(table).map(([key, value]) => replace(key, value)),
  stripNormalizer(),
  replace("\\s+", " "),
]);
process.stdout.write("done\n");

process.stdout.write("converting... ");
let idx = 0;
inStream.on("line", (line) => {
  fs.appendFileSync(
    "baiducorpus_conv.txt",
    custNorm.normalizeString(line) + "\n"
  );
  if (idx % 100 === 0) console.log(`completed #${idx}`);
});
// input.on("line", () => {
//   let chunk;
//   while ((chunk = input.read(1)) !== null) {
//     output.write(table[chunk] ?? chunk);
//   }
// });
inStream.on("close", () => process.stdout.write("done\n"));
