let mix = require("laravel-mix");
let path = require("path");

mix
  .ts("src/JsonApi.ts", "dist/index.js")
  .ts("src/test.ts", "dist/")
  .alias({
    "@": path.join(__dirname, "src/"),
  })
  .setPublicPath("dist");
