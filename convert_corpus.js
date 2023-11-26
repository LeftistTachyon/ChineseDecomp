const fs = require("fs");
const readline = require("readline");

process.stdout.write("preparing files... ");
const input = fs.createReadStream("baidubaike_corpus.txt", {
  encoding: "utf8",
  fd: null,
});
const inStream = readline.createInterface({
  input,
  crlfDelay: Infinity,
});
if (fs.existsSync("baiducorpus_conv.jsonl"))
  fs.unlinkSync("baiducorpus_conv.jsonl");
// const output = fs.createWriteStream("baiducorpus_conv.jsonl", {
//   encoding: "utf8",
//   fd: null,
// });
process.stdout.write("done\n");

process.stdout.write("converting... ");
let idx = 0;
inStream.on("line", (line) => {
  fs.appendFileSync(
    "baiducorpus_conv.jsonl",
    JSON.stringify({ text: line.trim() }) + "\n"
  );
  if (++idx % 1_000 === 0) console.log(`completed #${idx}`);
});
// input.on("line", () => {
//   let chunk;
//   while ((chunk = input.read(1)) !== null) {
//     output.write(table[chunk] ?? chunk);
//   }
// });
inStream.on("close", () => process.stdout.write("done\n"));
