/* compress-kit — the shared compression core for drsamonline apps.
 *
 * One file, no dependencies. Wraps the platform's Compression Streams
 * (gzip / deflate / deflate-raw) so apps never bundle a compression library.
 * The browser counterpart to `lexora` (which compresses on the server/CLI).
 *
 *   const gz  = await Compress.gzip(bytes);
 *   const raw = await Compress.gunzip(gz);
 *
 * PolyForm Noncommercial 1.0.0. (c) 2026 Dr Sohil Momin.
 */
(function (root) {
  "use strict";
  var C = { version: "0.1.0" };

  var hasCS = (typeof root.CompressionStream !== "undefined") &&
              (typeof root.DecompressionStream !== "undefined");
  C.available = function () { return hasCS; };

  /* ---------- bytes ---------- */
  var enc = typeof TextEncoder !== "undefined" ? new TextEncoder() : null;
  var dec = typeof TextDecoder !== "undefined" ? new TextDecoder() : null;
  C.bytes = {
    fromText: function (s) { return enc ? enc.encode(s) : Uint8Array.from(unescape(encodeURIComponent(s)), function (c) { return c.charCodeAt(0); }); },
    toText: function (b) { return dec ? dec.decode(b) : decodeURIComponent(escape(String.fromCharCode.apply(null, b))); },
    toBase64: function (b) {
      var s = "", i;
      for (i = 0; i < b.length; i++) s += String.fromCharCode(b[i]);
      return (typeof btoa !== "undefined") ? btoa(s) : Buffer.from(b).toString("base64");
    },
    fromBase64: function (s) {
      if (typeof atob !== "undefined") { var bin = atob(s), a = new Uint8Array(bin.length); for (var i = 0; i < bin.length; i++) a[i] = bin.charCodeAt(i); return a; }
      return new Uint8Array(Buffer.from(s, "base64"));
    }
  };

  /* ---------- stream plumbing ---------- */
  function transform(bytes, format, kind) {
    if (!hasCS) return Promise.reject(new Error("compress-kit needs Compression Streams (a modern browser or Node 18+)"));
    var stream = (kind === "compress") ? new root.CompressionStream(format) : new root.DecompressionStream(format);
    var writer = stream.writable.getWriter();
    var reader = stream.readable.getReader();
    var chunks = [], total = 0;
    var done = writer.write(bytes).then(function () { return writer.close(); });
    return new Promise(function (resolve, reject) {
      done.catch(reject);
      (function pump() {
        reader.read().then(function (r) {
          if (r.done) {
            var out = new Uint8Array(total), off = 0;
            for (var i = 0; i < chunks.length; i++) { out.set(chunks[i], off); off += chunks[i].length; }
            resolve(out);
          } else {
            chunks.push(r.value); total += r.value.length; pump();
          }
        }, reject);
      })();
    });
  }

  C.gzip = function (bytes) { return transform(bytes, "gzip", "compress"); };
  C.gunzip = function (bytes) { return transform(bytes, "gzip", "decompress"); };
  C.deflate = function (bytes) { return transform(bytes, "deflate", "compress"); };
  C.inflate = function (bytes) { return transform(bytes, "deflate", "decompress"); };
  C.deflateRaw = function (bytes) { return transform(bytes, "deflate-raw", "compress"); };
  C.inflateRaw = function (bytes) { return transform(bytes, "deflate-raw", "decompress"); };

  /* ---------- string helpers ---------- */
  C.compressString = function (text, format) {
    return transform(C.bytes.fromText(text), format || "gzip", "compress").then(function (b) { return C.bytes.toBase64(b); });
  };
  C.decompressString = function (b64, format) {
    return transform(C.bytes.fromBase64(b64), format || "gzip", "decompress").then(function (b) { return C.bytes.toText(b); });
  };

  /* ---------- helpers ---------- */
  C.ratio = function (original, compressed) {
    return original ? (compressed / original) : 0;
  };
  C.human = function (n) {
    if (n < 1024) return n + " B";
    if (n < 1024 * 1024) return (n / 1024).toFixed(1) + " KB";
    return (n / 1048576).toFixed(1) + " MB";
  };

  root.Compress = C;
})(typeof globalThis !== "undefined" ? globalThis : this);
