let mix = require("laravel-mix");

mix
  .ts("src/JsonApi.ts", "dist/index.js")
  .ts("src/test.ts", "dist/")
  .setPublicPath("dist");
