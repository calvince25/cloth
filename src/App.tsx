import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Contact from './pages/Contact';
import Blog from './pages/Blog';
import About from './pages/About';
import Login from './pages/Login';

// Admin imports
import AdminRoute from './components/AdminRoute';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import Products from './pages/admin/Products';
import Blogs from './pages/admin/Blogs';
import Users from './pages/admin/Users';
import Contacts from './pages/admin/Contacts';

import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import ScrollToTop from './components/ScrollToTop';

export default function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <Router>
          <ScrollToTop />
          <div className="min-h-screen flex flex-col">
            <Routes>
              {/* Public Storefront Routes with Layout Components */}
              <Route path="/" element={<><Navbar /><main className="flex-grow"><Home /></main><Footer /><WhatsAppButton /></>} />
              <Route path="/shop" element={<><Navbar /><main className="flex-grow"><Shop /></main><Footer /><WhatsAppButton /></>} />
              <Route path="/women" element={<><Navbar /><main className="flex-grow"><Shop category="women" /></main><Footer /><WhatsAppButton /></>} />
              <Route path="/men" element={<><Navbar /><main className="flex-grow"><Shop category="men" /></main><Footer /><WhatsAppButton /></>} />
              <Route path="/kids" element={<><Navbar /><main className="flex-grow"><Shop category="kids" /></main><Footer /><WhatsAppButton /></>} />
              <Route path="/new" element={<><Navbar /><main className="flex-grow"><Shop filter="new" /></main><Footer /><WhatsAppButton /></>} />
              <Route path="/sale" element={<><Navbar /><main className="flex-grow"><Shop filter="sale" /></main><Footer /><WhatsAppButton /></>} />
              <Route path="/product/:id" element={<><Navbar /><main className="flex-grow"><ProductDetail /></main><Footer /><WhatsAppButton /></>} />
              <Route path="/blog" element={<><Navbar /><main className="flex-grow"><Blog /></main><Footer /><WhatsAppButton /></>} />
              <Route path="/about" element={<><Navbar /><main className="flex-grow"><About /></main><Footer /><WhatsAppButton /></>} />
              <Route path="/contact" element={<><Navbar /><main className="flex-grow"><Contact /></main><Footer /><WhatsAppButton /></>} />
              
              {/* Auth Route */}
              <Route path="/login" element={<Login />} />

              {/* Protected Admin Routes */}
              <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
                <Route index element={<Dashboard />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="products" element={<Products />} />
                <Route path="blogs" element={<Blogs />} />
                <Route path="users" element={<Users />} />
                <Route path="contacts" element={<Contacts />} />
              </Route>
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </HelmetProvider>
  );
}
