require("glob")("src/**/*.html", (er, files) => {
  for (const from of files) {
    const to = from.replace("src", "lib")
    require("fs").copyFileSync(from, to);
    console.log('Copied', from, '->', to)
  }
});