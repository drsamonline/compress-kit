# compress-kit

[![live](https://img.shields.io/badge/live-online-22c55e)](https://drsamonline.github.io/compress-kit/)
[![license](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

**The shared compression core for drsamonline apps.** One file, no dependencies,
built on the platform's **Compression Streams**.

The browser counterpart to `lexora` (which compresses on the CLI/server). Apps
never bundle a compression library:

```js
const gz  = await Compress.gzip(bytes);      // -> Uint8Array
const raw = await Compress.gunzip(gz);       // -> Uint8Array

const b64 = await Compress.compressString("lots of text…");
const txt = await Compress.decompressString(b64);
```

## API

| Call | Does |
|---|---|
| `Compress.gzip` / `gunzip` | gzip (with header). |
| `Compress.deflate` / `inflate` | zlib deflate. |
| `Compress.deflateRaw` / `inflateRaw` | raw deflate (no header) — smallest. |
| `Compress.compressString` / `decompressString` | Text ⇄ base64, any format. |
| `Compress.ratio(original, compressed)` | Compressed/original, for a UI. |
| `Compress.human(n)` | "12.4 KB" style formatting. |
| `Compress.bytes` | text/base64 helpers. |

## Why not a library

Compression Streams are built into modern browsers and Node 18+, so a
compression library is dead weight. This wrapper is the one place the plumbing
lives — and it reads the stream directly, so it needs no `Response`/`Blob` and
runs everywhere the streams exist.

## Verified

```
node test-node.js
PASS  gzip round-trip
PASS  deflate round-trip
PASS  deflate-raw round-trip
PASS  repetitive data compresses well
PASS  string round-trip
PASS  unicode survives
6 passed, 0 failed
```

## Environment

Needs **Compression Streams** — Chrome 80+, Firefox 113+, Safari 16.4+, Node 18+.
`Compress.available()` reports it.

## Licence

MIT. (c) 2026 Dr Sohil Momin. Part of the Forge system — kits open, orchestrator licensed.
