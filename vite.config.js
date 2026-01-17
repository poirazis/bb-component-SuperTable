import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import postcss from "postcss";
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

// Custom plugin to clean the dist folder before building
const clean = () => ({
  name: "clean",
  apply: "build",
  buildStart() {
    const dist = "./dist/";
    if (existsSync(dist)) {
      readdirSync(dist).forEach((path) => {
        if (path.endsWith(".tar.gz")) {
          unlinkSync(dist + path);
        }
      });
    }
  },
});

// Custom plugin to inject CSS into the JS bundle
const injectCss = () => ({
  name: "inject-css",
  apply: "build",
  async writeBundle() {
    const distDir = "dist";
    const files = readdirSync(distDir);
    const cssFile = files.find((f) => f.endsWith(".css") && !f.startsWith("."));
    const jsFile = "plugin.min.js";

    if (cssFile) {
      const cssContent = readFileSync(`${distDir}/${cssFile}`, "utf8");
      const jsContent = readFileSync(`${distDir}/${jsFile}`, "utf8");

      // Inject CSS into JS as a style tag injection IIFE
      const cssInjection = `
(function() {
  const css = ${JSON.stringify(cssContent)};
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
})();
`;

      const updatedJs = cssInjection + jsContent;
      writeFileSync(`${distDir}/${jsFile}`, updatedJs);

      // Remove the CSS file
      unlinkSync(`${distDir}/${cssFile}`);
    }
  },
});

// Custom plugin to bundle up our files after building
const bundle = () => ({
  name: "bundle",
  async writeBundle() {
    // Add a small delay to ensure all files are fully written before tarring
    await new Promise((resolve) => setTimeout(resolve, 100));

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

export default defineConfig({
  plugins: [
    validateSchema(),
    postcss(),
    svelte({
      compilerOptions: {
        compatibility: {
          componentApi: 4,
        },
      },
      emitCss: true,
      preprocess: [],
    }),
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
      plugins: [
        clean(),
        injectCss(),
        {
          name: "copy-and-hash-assets",
          apply: "build",
          async writeBundle() {
            // Copy schema.json and package.json to dist
            const schema = readFileSync("schema.json", "utf8");
            writeFileSync("dist/schema.json", schema);
            const packageJson = readFileSync("package.json", "utf8");
            writeFileSync("dist/package.json", packageJson);

            // Generate JS hash
            const fileBuffer = readFileSync("dist/plugin.min.js");
            const hashSum = createHash("sha1");
            hashSum.update(fileBuffer);
            const hex = hashSum.digest("hex");

            // Update schema with hash
            const parsedSchema = JSON.parse(
              readFileSync("dist/schema.json", "utf8")
            );
            const newSchema = {
              ...parsedSchema,
              hash: hex,
              version: pkg.version,
            };
            writeFileSync(
              "dist/schema.json",
              JSON.stringify(newSchema, null, 2)
            );
          },
        },
        bundle(),
      ],
    },
  },
});
