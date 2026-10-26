import http from "http";
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImxvZ2VvIjoiY2xpZW50ZV90ZXN0IiwidGlwbyI6ImNsaWVudGUiLCJyb2xlcyI6WyJDTElFTlRFIl0sInBlcm1pc29zIjpbIkNMSV9WRVIiXSwiaWF0IjoxNzkyOTY3NDEyLCJleHAiOjE3OTI5NzEwMTJ9.rQmIhr0-VeXI93toyjZmmddJbJSJMLR7ulz3u3t4x8c";
function get(path, auth = true) {
  return new Promise((resolve) => {
    const headers = { "User-Agent": "curl/8.5.0" };
    if (auth) headers.Authorization = "Bearer " + token;
    const req = http.get({ hostname: "localhost", port: 3001, path: path, headers: headers, timeout: 10000 }, (res) => { let d = ""; res.on("data", c => d += c); res.on("end", () => resolve({ status: res.statusCode, body: d })); });
    req.on("timeout", () => { req.destroy(); resolve({ status: "TIMEOUT", body: "" }); });
    req.on("error", (e) => resolve({ status: "ERROR", body: e.message }));
  });
}
async function main() {
  console.log("=== SALUD ===");
  const h = await get("/api/v1/health", false);
  console.log("health:", h.status, h.body);
  console.log("=== DEPARTAMENTOS ===");
  const d = await get("/api/v1/maestros/departamentos");
  console.log("departamentos:", d.status, d.body.slice(0, 500));
  console.log("=== PROVINCIAS ===");
  const p = await get("/api/v1/maestros/provincias?departamento=1");
  console.log("provincias:", p.status, p.body.slice(0, 500));
  console.log("=== DISTRITOS ===");
  const di = await get("/api/v1/maestros/distritos?provincia=1");
  console.log("distritos:", di.status, di.body.slice(0, 500));
  console.log("=== SIN TOKEN ===");
  const s = await get("/api/v1/maestros/departamentos", false);
  console.log("sin_token:", s.status, s.body.slice(0, 200));
  console.log("=== PROVINCIAS SIN DEPTO ===");
  const p2 = await get("/api/v1/maestros/provincias");
  console.log("provincias_sin_depto:", p2.status, p2.body.slice(0, 200));
}
main().catch(console.error);
