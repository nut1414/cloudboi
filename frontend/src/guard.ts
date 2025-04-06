import { LoaderFunctionArgs, redirect } from "react-router-dom"
import { UserService } from "./client"

// Helper to get authentication status without hooks (for loaders)
async function checkAuthStatus() {
  try {
    
    const response = await UserService.userGetUserSession()
    return {
      user: response.data ?? null,
      isAuthenticated: !!response.data?.is_authenticated || false
    }
  } catch (error) {
    return {
      user: null,
      isAuthenticated: false
    }
  }
}

// Guard for public-only routes (login/signup)
export async function publicOnlyGuard() {
  const { user, isAuthenticated } = await checkAuthStatus()
  
  if (isAuthenticated && user?.username !== "") {
    return redirect(`/user/${user?.username}/instance`)
  }
  
  return null
}

// Guard for user-specific routes
export async function userRouteGuard({ params }: LoaderFunctionArgs) {
  const { userName } = params
  const { user, isAuthenticated } = await checkAuthStatus()
  
  if (!isAuthenticated) {
    return redirect('/login')
  }
  
  // Allow admins to access any user's routes, but redirect normal users if they try to access another user's routes
  if (isAuthenticated && user?.username && user.username !== "" && userName !== user.username) {
    // Check if the user is an admin
    const isAdmin = user?.role === "admin"
    
    // If not admin, redirect to their own user route
    if (!isAdmin) {
      return redirect(`/user/${user.username}/instance`)
    }
  }
  
  return { user }
}

export async function adminRouteGuard() {
  const { user, isAuthenticated } = await checkAuthStatus()
  
  if (!isAuthenticated || user?.role !== "admin") {
    return redirect('/login')
  }

  return { user }
}
