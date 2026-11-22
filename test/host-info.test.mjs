// KOTOBA-159 prep: the page no longer asks the Tauri host over IPC for its id. The build passes the same
// value in (dist/host-info.js); it must equal the tauri.conf.json identifier and awai_host_info's "app".
import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

const root = fileURLToPath(new URL("../", import.meta.url));
const read = (p) => readFile(resolve(root, p), "utf8");

test("host-info.js carries the same app id the host command returned", async () => {
  const { hostInfo } = await import(resolve(root, "dist/host-info.js"));
  const conf = JSON.parse(await read("src-tauri/tauri.conf.json"));
  const rust = /"app"\s*:\s*"([^"]+)"/.exec(await read("src-tauri/src/lib.rs"))[1];
  assert.deepEqual(hostInfo, { schema: "awai.shell.host.v1", app: conf.identifier });
  assert.equal(hostInfo.app, rust);
  assert.ok(JSON.parse(await read("dist/release.json")).files["host-info.js"], "host-info.js is pinned");
});

test("the page makes no Tauri IPC call", async () => {
  for (const file of ["dist/app.js", "src/ui/app.js"]) {
    const src = await read(file);
    assert.doesNotMatch(src, /__TAURI__|__TAURI_INTERNALS__|\binvoke\(/, file);
  }
  assert.match(await read("dist/app.js"), /from "\.\/host-info\.js"/);
});
