import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'

// Import the generated route tree
import { routeTree } from './routeTree.gen'
import 'bootstrap/dist/css/bootstrap.min.css';
import {serviceInit} from "./authService/firebaseAuthService.ts";
import './index.css';
// Create a new router instance
const router = createRouter({ routeTree })

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
//Firebase Service Init
serviceInit();

// Render the app
const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
      <StrictMode>
        <RouterProvider router={router} />
      </StrictMode>,
  )
}