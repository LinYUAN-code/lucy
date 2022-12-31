import typescript from "rollup-plugin-typescript2";
import commonjs from "@rollup/plugin-commonjs";
import { terser } from "rollup-plugin-terser";
import path from "path";

export default [
  {
    input: path.join(__dirname, "./src/index.ts"),
    output: {
      file: "dist/index.js",
      format: "esm",
    },
    plugins: [
      typescript({ tsconfig: "./tsconfig.json" }),
      commonjs(),
      terser(),
    ],
  },
];
