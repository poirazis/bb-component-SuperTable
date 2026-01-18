import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { viteSingleFile } from "vite-plugin-singlefile";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";
import { fileURLToPath } from "url";
import {
  readFileSync,
  existsSync,
  readdirSync,
  unlinkSync,
  writeFileSync,
  createWriteStream,
} from "fs";
import { createHash } from "crypto";
import * as tar from "tar";
import { validate } from "@budibase/backend-core/plugins";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const pkg = JSON.parse(
  readFileSync(new URL("./package.json", import.meta.url), "utf8")
);

const clean = () => ({
  name: "clean",
  apply: "build",
  buildStart() {
    const dist = "./dist/";
    if (existsSync(dist)) {
      readdirSync(dist).forEach((path) => {
        if (path.endsWith(".tar.gz")) unlinkSync(dist + path);
      });
    }
  },
});

const bundle = () => ({
  name: "bundle",
  async writeBundle() {
    await new Promise((r) => setTimeout(r, 100));
    const bundleName = `${pkg.name}-${pkg.version}.tar.gz`;
    return new Promise((resolve, reject) => {
      tar
        .c({ gzip: true, cwd: "dist" }, [
          "plugin.min.js",
          "schema.json",
          "package.json",
        ])
        .pipe(createWriteStream(`dist/${bundleName}`))
        .on("finish", resolve)
        .on("error", reject);
    });
  },
});

const validateSchema = () => ({
  name: "validate-schema",
  apply: "build",
  buildStart() {
    const schema = readFileSync("schema.json", "utf8");
    validate(JSON.parse(schema));
  },
});

const copyAndHash = () => ({
  name: "copy-and-hash",
  apply: "build",
  async writeBundle() {
    writeFileSync("dist/schema.json", readFileSync("schema.json", "utf8"));
    writeFileSync("dist/package.json", readFileSync("package.json", "utf8"));

    const jsBuffer = readFileSync("dist/plugin.min.js");
    const hash = createHash("sha1").update(jsBuffer).digest("hex");

    const schema = JSON.parse(readFileSync("dist/schema.json", "utf8"));
    writeFileSync(
      "dist/schema.json",
      JSON.stringify(
        {
          ...schema,
          hash,
          version: pkg.version,
        },
        null,
        2
      )
    );
  },
});

export default defineConfig({
  plugins: [
    clean(),
    validateSchema(),
    svelte({
      compilerOptions: { compatibility: { componentApi: 4 } },
      emitCss: true,
      preprocess: [],
    }),
    cssInjectedByJsPlugin(),
    viteSingleFile(),
    copyAndHash(),
    bundle(),
  ],
  build: {
    target: "esnext",
    lib: {
      entry: "index.ts",
      formats: ["iife"],
      fileName: () => "plugin.min.js",
      name: "plugin",
    },
    outDir: "dist",
    minify: "terser",
    sourcemap: false,
    cssCodeSplit: false,
    rollupOptions: {
      external: (id) => id === "svelte" || id.startsWith("svelte/"),
      treeshake: {
        moduleSideEffects: false,
        preset: "recommended",
      },
      output: {
        globals: (id) => {
          if (id === "svelte/store") return "svelteStore";
          if (id === "svelte/transition") return "svelteTransition";
          if (id === "svelte/animate") return "svelteAnimate";
          if (id === "svelte/motion") return "svelteMotion";
          if (id === "svelte/easing") return "svelteEasing";
          if (id.includes("/internal")) return "svelteInternal";
          return "svelte";
        },
      },
    },
  },
});
