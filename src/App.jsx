import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Features from './components/Features'
import TrustBadges from './components/TrustBadges'
import Footer from './components/Footer'
import Login from './components/Login'
import Signup from './components/Signup'

// Extract your existing landing page into a component
function LandingPage() {
  return (
    <>
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-500/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-violet-500/8 blur-[120px]" />
        <div className="absolute top-[40%] right-[20%] w-[30%] h-[30%] rounded-full bg-fuchsia-500/5 blur-[100px]" />
      </div>
      <Navbar />
      <Hero />
      <Features />
      <TrustBadges />
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <div className="min-h-screen bg-ink-950 overflow-hidden">
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </Router>
    </div>
  )
}