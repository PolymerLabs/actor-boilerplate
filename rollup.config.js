import typescript from "rollup-plugin-typescript2";
import nodeResolve from "rollup-plugin-node-resolve";
import css from "./utils/rollup-plugin-css";
import markup from "./utils/rollup-plugin-markup";
import { terser } from "rollup-plugin-terser";

// Delete 'dist'
require("rimraf").sync("dist");

export default {
  input: [
    "src/bootstrap.ts",
    "src/state-worker.ts",
    "src/sw.ts",
    "src/components/components.ts"
  ],
  output: {
    dir: "dist",
    format: "es",
    sourcemap: process.env.SOURCEMAPS ? "inline" : false
  },
  plugins: [
    typescript({
      clean: true,
      // Make sure we are using our version of TypeScript.
      typescript: require("typescript"),
      tsconfigOverride: {
        compilerOptions: {
          sourceMap: true
        }
      }
    }),
    nodeResolve(),
    terser(),
    css(),
    markup()
  ],
  experimentalCodeSplitting: true
};
