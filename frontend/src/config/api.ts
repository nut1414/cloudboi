import { Config } from "@hey-api/client-axios"

const getBaseURL = () => {
  const app_env = import.meta.env.VITE_APP_ENV || import.meta.env.APP_ENV || 'dev'
  
  // In test APP_ENV, use docker proxy
  if (app_env === 'test') {
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