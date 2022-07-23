let mix = require("laravel-mix");

mix.ts("src/*", "dist/index.js").setPublicPath("dist");
