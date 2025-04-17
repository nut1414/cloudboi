import { Config } from "@hey-api/client-axios"

const getBaseURL = () => {
  const mode = import.meta.env.VITE_MODE || import.meta.env.MODE || 'dev'
  
  // In test mode, use docker proxy
  if (mode === 'test') {
    return 'proxy/api'
  }
  
  return import.meta.env.VITE_API_URL || 'localhost:80/api'
}

const baseURL = getBaseURL()

export const API_CONFIG: Config = {
  baseURL: `http://${baseURL}`,
  withCredentials: true,
  throwOnError: true,
}

export const WS_URL = `ws://${baseURL}`