"use strict";

// ─────────────────────────────────────────────────────────────────────────────
//  global_config.ts
//
//  All runtime values come from environment variables injected by Vue CLI at
//  build time.  Set them in:
//    .env.development   →  npm run serve  (local debug)
//    .env.production    →  npm run build  (Docker / server deploy)
//
//  Never hardcode IPs, ports, or secrets here.
//  See .env.example for the full list of supported variables.
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  // ── Auth ────────────────────────────────────────────────────────
  api_id: process.env.VUE_APP_API_ID || "dongrixinyu",
  text_length: parseInt(process.env.VUE_APP_TEXT_LENGTH || "18", 10),

  // ── Backend ─────────────────────────────────────────────────────
  backend_ip:   process.env.VUE_APP_BACKEND_IP   || "127.0.0.1",
  backend_port: parseInt(process.env.VUE_APP_BACKEND_PORT || "16666", 10),

  // ── Frontend ────────────────────────────────────────────────────
  frontend_ip:   process.env.VUE_APP_FRONTEND_IP   || "127.0.0.1",
  frontend_port: parseInt(process.env.VUE_APP_FRONTEND_PORT || "8080", 10),

  // ── Asset host ──────────────────────────────────────────────────
  // Base URL for blog image links rendered in the browser.
  //   dev  → http://127.0.0.1:16666   (direct to backend)
  //   prod → https://www.jionlp.com   (through nginx)
  blog_asset_host: process.env.VUE_APP_BLOG_ASSET_HOST || "http://127.0.0.1:16666",
};
