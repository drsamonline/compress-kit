# compress-kit — merged into export-kit

**This kit is no longer maintained on its own.** On 2026-11-12 it was folded into
**[export-kit](https://github.com/drsamonline/export-kit)** as version 2.0.0.

## Why

`export-kit` wrote a **store-only** ZIP — an archive with no compression in it — because the
compressor lived here, in a repository nothing there depended on. Two kits that are only
useful together are one kit.

## What to use instead

```js
const E = require("export-kit.js");

const gz  = await E.gzip(bytes);          // also gunzip, deflate, inflate, deflateRaw
const zip = await E.zipCompressed(files); // method 8, falls back to store
```

| Old | New |
|---|---|
| `Compress.gzip/gunzip` | `Export.gzip/gunzip` |
| `Compress.deflate/inflate` | `Export.deflate/inflate` |
| `Compress.deflateRaw/inflateRaw` | `Export.deflateRaw/inflateRaw` |
| `Compress.compressString/decompressString` | `Export.compressString/decompressString` |
| `Compress.available()` | `Export.compressionAvailable()` |
| `Compress.ratio` | `Export.compressionRatio` |
| `Compress.human` | `Export.human` |
| `Compress.bytes.toBase64/fromBase64` | `Export.toBase64/fromBase64` |

This repository stays readable so that anything vendoring it still resolves; the code here is
frozen at the last version before the merge.
