import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import './index.css'
import { MediaProvider } from './context/MediaContext'
import { AdminProvider } from './context/AdminContext'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

//React-router routes
import Loading from './pages/loading.jsx'
import Home from './pages/home.jsx'
import Contact from './pages/contact.jsx'
import AdminDashboard from './pages/admin.jsx'

// Get your Clerk publishable key from environment variable
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key")
}

const root = createRoot(document.getElementById('root'))
root.render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <AdminProvider>
        <MediaProvider>
          <Router>
            <Routes>
              <Route path="/">
                <Route index element={<Loading />} />
                <Route path="home" element={<Home />} />
                <Route path="contact" element={<Contact />} />
                <Route path="admin" element={<AdminDashboard />} />
              </Route>
            </Routes>
          </Router>
        </MediaProvider>
      </AdminProvider>
    </ClerkProvider>
  </StrictMode>,
)
