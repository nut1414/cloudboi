import { Config } from "@hey-api/client-axios"

const getBaseURL = () => {
  const mode = import.meta.env.MODE || 'dev'
  
  // In production, use the provided API_URL
  if (mode === 'production') {
    return import.meta.env.API_URL || 'localhost:8000'
  }
  
  // In test mode, use backend service name
  if (mode === 'test') {
    return 'backend:8000'
  }
  
  // Default to localhost in dev mode
  return 'localhost:8000'
}

const baseURL = getBaseURL()

export const API_CONFIG: Config = {
  baseURL: `http://${baseURL}`,
  withCredentials: true,
  throwOnError: true,
}

export const WS_URL = `ws://${baseURL}`