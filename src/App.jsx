import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Features from './components/Features'
import TrustBadges from './components/TrustBadges'
import ChartsSection from './components/ChartsSection'
import Testimonials from './components/Testimonials'
import CtaSection from './components/CtaSection'
import Footer from './components/Footer'
import BackgroundShader from './components/BackgroundShader'
import Login from './components/Login'
import Signup from './components/Signup'
import DashboardLayout from './components/DashboardLayout'
import DashboardHome from './components/DashboardHome'
import ProductsPage from './components/ProductsPage'
import OrdersPage from './components/OrdersPage'
import WarehousesPage from './components/WarehousesPage'
import SuppliersPage from './components/SuppliersPage'
import ReceivingPage from './components/ReceivingPage'
import StockLevelsPage from './components/StockLevelsPage'

function LandingPage() {
  return (
    <>
      <BackgroundShader />
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-500/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-violet-500/8 blur-[120px]" />
        <div className="absolute top-[40%] right-[20%] w-[30%] h-[30%] rounded-full bg-fuchsia-500/5 blur-[100px]" />
      </div>
      <Navbar />
      <Hero />
      <Features />
      <ChartsSection />
      <Testimonials />
      <TrustBadges />
      <CtaSection />
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <div className="min-h-screen bg-ink-950 overflow-hidden text-white">
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Dashboard Routes */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="stock" element={<StockLevelsPage />} />
            <Route path="warehouses" element={<WarehousesPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="suppliers" element={<SuppliersPage />} />
            <Route path="receiving" element={<ReceivingPage />} />
          </Route>
        </Routes>
      </Router>
    </div>
  )
}