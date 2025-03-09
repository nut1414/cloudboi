import { StrictMode, Suspense } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import { RouterProvider } from "react-router-dom"
import router from "./router.tsx"
import { UserProvider } from "./contexts/userContext.tsx"

// Need to add a global loading fallback component and error boundary
// to handle loading states and errors in the application
const GlobalLoadingFallback = () => (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="text-lg">Loading...</div>
    </div>
)

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Suspense fallback={<GlobalLoadingFallback />}>
      <UserProvider>
        <RouterProvider router={router} />
      </UserProvider>
    </Suspense>
  </StrictMode>
)
