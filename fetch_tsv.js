const fs = require("fs");
const jsdom = require("jsdom");

(async () => {
  process.stdout.write("fetching... ");
  const resp = await fetch(
    "https://commons.wikimedia.org/wiki/User:Artsakenos/CCD-TSV"
  );
  const respText = await resp.text();
  process.stdout.write("done\n");

  process.stdout.write("converting to html... ");
  const newDOM = new jsdom.JSDOM(respText);
  const tsvElement =
    newDOM.window.document.getElementsByClassName("mw-parser-output")[0];
  process.stdout.write("done\n");

  process.stdout.write("writing to file... ");
  fs.writeFileSync("ccd.tsv", tsvElement.textContent);
  process.stdout.write("done\n");
})();
