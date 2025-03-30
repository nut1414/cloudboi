import { StrictMode, Suspense } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import { RouterProvider } from "react-router-dom"
import router from "./router.tsx"
import { AppProviders } from "./contexts/AppProviders.tsx"
import GlobalLoading from "./components/GlobalLoading.tsx"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Suspense fallback={<GlobalLoading />}>
      <AppProviders>
        <RouterProvider router={router} />
      </AppProviders>
    </Suspense>
  </StrictMode>
)
