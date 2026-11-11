# compress-kit — API reference

**Version 1.0.0.** **The shared compression core for drsamonline apps.** One file, no dependencies, built on the platform's **Compression Streams**.

Generated from the source in this repository: every name, argument and
note below is read out of the kit file, so it cannot describe a function
that is not there.

```js
<script src="compress-kit.js"></script>
Kit.available(...)
// or: const Kit = require('./compress-kit.js')
```

## The surface (12 entries)

| Name | Arguments | What it does |
|---|---|---|
| `Kit.available` | `()` | — |
| `Kit.bytes` | `()` | — |
| `Kit.gzip` | `(bytes)` | — |
| `Kit.gunzip` | `(bytes)` | — |
| `Kit.deflate` | `(bytes)` | — |
| `Kit.inflate` | `(bytes)` | — |
| `Kit.deflateRaw` | `(bytes)` | — |
| `Kit.inflateRaw` | `(bytes)` | — |
| `Kit.compressString` | `(text, format)` | — |
| `Kit.decompressString` | `(b64, format)` | — |
| `Kit.ratio` | `(original, compressed)` | — |
| `Kit.human` | `(n)` | — |

## Notes

- Zero dependencies, one file, no build step: it works from `file://`, from a
  `<script>` tag and from Node.
- The version above is the `VERSION` file in this repository; a pinned copy is
  what an app vendors.
