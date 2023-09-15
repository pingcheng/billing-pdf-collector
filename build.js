const esbuild = require("esbuild");

// build the lambda js
esbuild.buildSync({
  entryPoints: ["src/index.ts"],
  bundle: true,
  platform: "node",
  target: "node18",
  minify: true,
  sourcemap: true,
  outfile: "dist/index.js",
});
