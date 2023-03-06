const cmd = require("node-cmd");
const fs = require("fs");

const baseDir = "./learnAssembly/";
const outputDir = "./output/";

function build(name = "") {
  console.log("build...");
  if (name) {
    cmd.runSync(`as ${baseDir}${name}.s -g -o ${outputDir}${name}.o`);
    cmd.runSync(
      `ld ${outputDir}${name}.o -o ${outputDir}${name} -L /Library/Developer/CommandLineTools/SDKs/MacOSX.sdk/usr/lib -lSystem`
    );
    console.log("done...");
    return;
  }
  let res = fs.readdirSync(baseDir);
  for (let name of res) {
    if (name.match(/\.s$/)) {
      const fileName = name.split(".s")[0];
      cmd.runSync(`as ${baseDir}${name} -g -o ${outputDir}${fileName}.o`);
      cmd.runSync(
        `ld ${outputDir}${fileName}.o -o ${outputDir}${fileName} -L /Library/Developer/CommandLineTools/SDKs/MacOSX.sdk/usr/lib -lSystem`
      );
    }
  }
  console.log("done...");
}
function clean(name, sub, options) {
  console.log("clean...");
  let res = fs.readdirSync(outputDir);
  for (let name of res) {
    if (name.match(/\.o$/)) {
      const fileName = name.split(".o")[0];
      cmd.runSync(`rm ${outputDir}${name}`);
      try {
        cmd.runSync(`rm ${outputDir}${fileName}`);
      } catch (e) {}
    }
  }
  console.log("done...");
}

const args = process.argv.slice(process.argv.indexOf("--") + 1);
switch (args[0]) {
  case "build":
    build(...args.slice(1));
    break;
  case "clean":
    clean(...args.slice(1));
    break;
}
