require("glob")("src/**/*.html", (er, files) => {
  for (const file of files) {
    require("fs").copyFileSync(file, file.replace("src", "lib"));
  }
});