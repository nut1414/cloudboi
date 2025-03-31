import { Config } from "@hey-api/client-axios"

export const API_CONFIG: Config = {
  baseURL: "http://localhost:8000",
  withCredentials: true,
  throwOnError: true,
}

export const WS_URL = 'ws://localhost:8000'