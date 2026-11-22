import { strict as assert } from "node:assert";
import { test } from "node:test";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { checkBuild, containsCredential } from "./check-public-build.mjs";

test("public configuration names and metadata are permitted", () => {
  assert.equal(containsCredential('NEXT_PUBLIC_SUPABASE_URL https://project.example.test FEATURE_ENABLED'), false);
  assert.equal(containsCredential("SUPABASE_SERVICE_ROLE_KEY"), false);
});

test("only the category is needed to flag a private service value or Supabase key", () => {
  const localOnly = "synthetic-build-fixture-value";
  assert.equal(containsCredential(JSON.stringify({ value: localOnly }), [localOnly]), true);
  const fakePublishable = ["sb", "publishable", "a".repeat(24)].join("_");
  assert.equal(containsCredential(fakePublishable), true);
  for (const role of ["anon", "service_role"]) {
    const token = [Buffer.from('{"alg":"HS256"}').toString("base64url"),
      Buffer.from(JSON.stringify({ role })).toString("base64url"), "synthetic-signature"].join(".");
    assert.equal(containsCredential(token), true);
  }
});

test("the build check only reads published output and redacts its failure", async () => {
  const directory = await mkdtemp(join(tmpdir(), "browser-build-test-"));
  const fixture = "opaque-value-for-local-tests";
  try {
    await mkdir(join(directory, "static"));
    await mkdir(join(directory, "server"));
    await writeFile(join(directory, "static", "client.js"), "console.log('ready')");
    await writeFile(join(directory, "server", "page.html"), "<main>Ready</main>");
    await writeFile(join(directory, "server", "handler.js"), fixture);
    assert.deepEqual(await checkBuild(directory, [fixture]), { staticFiles: 1, renderedFiles: 1 });
    await writeFile(join(directory, "server", "page.html"), fixture);
    await assert.rejects(checkBuild(directory, [fixture]), (error) =>
      error.message.includes("1 public build file") && !error.message.includes(fixture));
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
