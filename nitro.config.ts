//https://nitro.unjs.io/config
export default defineNitroConfig({
  srcDir: "server",
  compatibilityDate: "2025-03-30",
  experimental: {
    database: true,
    tasks: true,
  },
  devProxy: {
    "/db": {
      target: "http://127.0.0.1:8787",
      changeOrigin: true,
    },
  },
  preset: "cloudflare",
  runtimeConfig: {
    d1: {
      databaseId: "209eb634-572a-4b82-9e20-ba69bbf0e93d",
      databaseName: "totelink",
    },
  },
});
