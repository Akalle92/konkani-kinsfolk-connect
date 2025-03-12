
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './styles/index.css'

// Get the publishable key from the environment
const PUBLISHABLE_KEY = "pk_test_cG9wdWxhci1waXJhbmhhLTEwLmNsZXJrLmFjY291bnRzLmRldiQ";

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key");
}

createRoot(document.getElementById("root")!).render(
  <ClerkProvider 
    publishableKey={PUBLISHABLE_KEY}
    appearance={{
      elements: {
        formButtonPrimary: 
          "bg-primary hover:bg-primary/90 text-white",
        card: "rounded-md shadow-sm",
        formFieldInput: 
          "rounded border border-input bg-background px-3 py-2 text-sm ring-offset-background",
        footerActionLink: 
          "text-primary hover:text-primary/90 font-medium"
      }
    }}
  >
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ClerkProvider>
);

