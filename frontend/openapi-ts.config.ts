import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  client: "@hey-api/client-axios",
  input: "http://localhost/api/openapi.json",
  output: "src/client",
  plugins: [
    {
      name: "@hey-api/services",
      asClass: true,
    },
    {
      name: "@hey-api/transformers",
      dates: true,
    },
    "@tanstack/react-query",
  ],
});
