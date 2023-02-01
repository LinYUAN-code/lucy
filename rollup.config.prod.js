import typescript from "rollup-plugin-typescript2";
import commonjs from "@rollup/plugin-commonjs";
import { terser } from "rollup-plugin-terser";
import path from "path";
import resolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import stripCode from "rollup-plugin-strip-code";

export default [
  {
    input: path.join(__dirname, "./src/index.ts"),
    output: [
      {
        file: "dist/index.esm.js",
        format: "esm",
      },
      {
        file: "dist/index.umd.js",
        format: "umd",
        name: "index",
      },
      {
        file: "dist/index.iife.js",
        format: "iife",
        name: "lucy",
      },
    ],
    plugins: [
      typescript({ tsconfig: "./tsconfig.json" }),
      replace({
        __env__: "'prod'",
        preventAssignment: true,
      }),
      stripCode({
        start_comment: "START.ONLYTEST",
        end_comment: "END.ONLYTEST",
      }),
      resolve(),
      commonjs(),
      terser(),
    ],
  },
];
