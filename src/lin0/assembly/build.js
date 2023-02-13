const cmd = require("node-cmd");
const args = require("args");
const fs = require("fs");

args.command("build", "build", build).command("clean", "clean", clean);
const baseDir = "./learnAssembly/";
const outputDir = "./output/";

function build(name, sub, options) {
  let res = fs.readdirSync(baseDir);
  for (let name of res) {
    if (name.match(/\.s$/)) {
      const fileName = name.split(".s")[0];
      cmd.runSync(`as ${baseDir}${name} -o ${outputDir}${fileName}.o`);
      cmd.runSync(
        `ld ${outputDir}${fileName}.o -o ${outputDir}${fileName} -L /Library/Developer/CommandLineTools/SDKs/MacOSX.sdk/usr/lib -lSystem`
      );
    }
  }
}
function clean(name, sub, options) {
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
}

const flags = args.parse(process.argv);
