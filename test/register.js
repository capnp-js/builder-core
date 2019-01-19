require("@babel/register")({
  presets: [["@babel/preset-env", {targets: {node: "8.9"}, modules: "commonjs"}]],
  plugins: ["@babel/transform-flow-strip-types"],
});
