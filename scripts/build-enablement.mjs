import { readFile, writeFile } from "node:fs/promises";

const pagePath = new URL("../enablement/index.html", import.meta.url);
const cssPath = new URL("../enablement/living-blueprint.css", import.meta.url);
const jsPath = new URL("../enablement/living-blueprint.js", import.meta.url);

const [page, css, js] = await Promise.all([
  readFile(pagePath, "utf8"),
  readFile(cssPath, "utf8"),
  readFile(jsPath, "utf8"),
]);

const stylePattern = /  <style>\r?\n[\s\S]*?  <\/style>/;
const scriptPattern = /  <script>\r?\n\(function \(\) \{[\s\S]*?  <\/script>/;

if (!stylePattern.test(page) || !scriptPattern.test(page)) {
  throw new Error("Enablement page markers were not found.");
}

const output = page
  .replace(stylePattern, `  <style>\n${css}\n  </style>`)
  .replace(scriptPattern, `  <script>\n${js}\n  </script>`);

await writeFile(pagePath, output, "utf8");
