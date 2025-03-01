import { StrictMode, Suspense } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import { RouterProvider } from "react-router-dom"
import router from "./router.tsx"
import { client } from "./client/services.gen.ts"
import { API_CONFIG } from "./config/api.ts"

// Need to add a global loading fallback component and error boundary
// to handle loading states and errors in the application
const GlobalLoadingFallback = () => (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="text-lg">Loading...</div>
    </div>
)

client.setConfig(API_CONFIG)

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Suspense fallback={<GlobalLoadingFallback />}>
      <RouterProvider router={router} />
    </Suspense>
  </StrictMode>
)
