import axios from "axios";

const config = require("@/global_config");

const backend_ip = config.backend_ip;
const backend_port = config.backend_port;

// 有 IP 访问频率限制
export const jio_backend = axios.create({
  baseURL: "http://" + backend_ip + ":" + backend_port,
  method: "POST",
  timeout: 5000,
  headers: { "Content-Type": "application/json" },
});

// 无 IP 访问频率限制
export const blog_backend = axios.create({
  baseURL: "http://" + backend_ip + ":" + backend_port,
  method: "POST",
  timeout: 7000,
  headers: { "Content-Type": "application/json" },
});

// export const stat_instance = axios.create({
//   baseURL: "http://" + backend_ip + ":" + backend_port,
//   method: "POST",
//   timeout: 7000,
//   headers: { "Content-Type": "application/json" },
// });
