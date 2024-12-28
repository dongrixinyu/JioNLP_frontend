import axios from "axios";

const config = require("@/global_config");

const blog_asset_host = config.blog_asset_host;

const blog_asset = axios.create({
  baseURL: blog_asset_host,
  method: "GET",
  timeout: 5000,
  headers: {
    // 'Origin': 'https://' + blog_asset_ip,
    "Content-Type": "text/markdown",
    // 'Access-Control-Allow-Origin': '*',
    // 'Access-Control-Allow-Methods': 'GET,OPTIONS',
  },
});

export default blog_asset;
