/* Node test for compress-kit. Node 18+ has CompressionStream. */
require(require("path").join(__dirname, "compress-kit.js"));
const C = global.Compress;

function eq(a, b) { if (a.length !== b.length) return false; for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false; return true; }
function repetitive(n) { const a = new Uint8Array(n); for (let i = 0; i < n; i++) a[i] = (i % 7 === 0) ? 65 : 32; return a; }
function random(n) { const a = new Uint8Array(n); for (let i = 0; i < n; i++) a[i] = (i * 2654435761) % 256; return a; }

let pass = 0, fail = 0;
async function ok(name, fn) { try { await fn(); pass++; console.log("PASS  " + name); } catch (e) { fail++; console.log("FAIL  " + name + "  — " + e.message); } }

(async function () {
  await ok("gzip round-trip", async () => {
    const d = random(5000);
    const back = await C.gunzip(await C.gzip(d));
    if (!eq(d, back)) throw new Error("mismatch");
  });
  await ok("deflate round-trip", async () => {
    const d = random(5000);
    const back = await C.inflate(await C.deflate(d));
    if (!eq(d, back)) throw new Error("mismatch");
  });
  await ok("deflate-raw round-trip", async () => {
    const d = random(5000);
    const back = await C.inflateRaw(await C.deflateRaw(d));
    if (!eq(d, back)) throw new Error("mismatch");
  });
  await ok("repetitive data compresses well", async () => {
    const d = repetitive(50000);
    const gz = await C.gzip(d);
    if (!(gz.length < d.length / 10)) throw new Error("ratio " + (gz.length / d.length).toFixed(3));
  });
  await ok("string round-trip", async () => {
    const s = "hello hello hello · नमस्ते · " + "x".repeat(200);
    const b64 = await C.compressString(s);
    if (await C.decompressString(b64) !== s) throw new Error("mismatch");
  });
  await ok("unicode survives", async () => {
    const s = "नमस्ते · કેમ છો · hello";
    if (await C.decompressString(await C.compressString(s)) !== s) throw new Error("mismatch");
  });

  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
})();
