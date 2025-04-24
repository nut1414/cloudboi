import { Config } from "@hey-api/client-axios"

const getBaseURL = () => {
  const app_env = !import.meta.env.DEV ? "prod": import.meta.env.VITE_APP_ENV || import.meta.env.APP_ENV || 'dev'
  
  // In test APP_ENV, use docker proxy
  if (app_env === 'test') {
    return 'http://proxy/api'
  }

  if (app_env === 'prod') {
    // workaround for not being able to pass environment variables to the production container
    return 'https://cloudboi.pnnp.cc/api'
  }
  
  // Development fallback
  return import.meta.env.VITE_API_URL || 'http://localhost:80/api'
}

const baseURL = getBaseURL()

export const API_CONFIG: Config = {
  baseURL: `${baseURL}`,
  withCredentials: true,
  throwOnError: true,
}

export const WS_URL = `${baseURL.replace('http', 'ws')}`