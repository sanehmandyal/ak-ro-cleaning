import { lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { ConfirmProvider } from './context/ConfirmContext';
import { SiteProvider } from './context/SiteContext';
import { AuthProvider } from './context/AuthContext';
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';

const Home = lazy(() => import('./pages/Home/Home'));
const About = lazy(() => import('./pages/About/About'));
const ServicesPage = lazy(() => import('./pages/Services/ServicesPage'));
const ServiceDetail = lazy(() => import('./pages/Services/ServiceDetail'));
const Gallery = lazy(() => import('./pages/Gallery/Gallery'));
const Contact = lazy(() => import('./pages/Contact/Contact'));
const Booking = lazy(() => import('./pages/Booking/Booking'));
const WaterTankCleaning = lazy(() => import('./pages/Services/WaterTankCleaningPage'));
const ROPurifierCleaning = lazy(() => import('./pages/Services/ROPurifierCleaningPage'));
const BathroomKitchenCleaning = lazy(() => import('./pages/Services/BathroomKitchenCleaningPage'));
const GlassWindowCleaning = lazy(() => import('./pages/Services/GlassWindowCleaningPage'));
const Locations = lazy(() => import('./pages/Locations/LocationsPage'));
const NotFound = lazy(() => import('./pages/NotFound'));

const Login = lazy(() => import('./pages/Admin/Login'));
const Dashboard = lazy(() => import('./pages/Admin/Dashboard'));
const Bookings = lazy(() => import('./pages/Admin/Bookings'));
const Inquiries = lazy(() => import('./pages/Admin/Inquiries'));
const ServicesAdmin = lazy(() => import('./pages/Admin/Services').then((m) => ({ default: m.ServicesList })));
const ServiceForm = lazy(() => import('./pages/Admin/Services').then((m) => ({ default: m.ServiceForm })));
const GalleryAdmin = lazy(() => import('./pages/Admin/Gallery'));
const Content = lazy(() => import('./pages/Admin/Content'));
const Testimonials = lazy(() => import('./pages/Admin/Testimonials'));
const Faqs = lazy(() => import('./pages/Admin/Faqs'));
const SeoAdmin = lazy(() => import('./pages/Admin/Seo'));
const Settings = lazy(() => import('./pages/Admin/Settings'));

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <ConfirmProvider>
          <SiteProvider>
            <AuthProvider>
              <Routes>
                <Route element={<PublicLayout />}>
                  <Route index element={<Home />} />
                  <Route path="about" element={<About />} />
                  <Route path="services" element={<ServicesPage />} />
                  <Route path="water-tank-cleaning" element={<WaterTankCleaning />} />
                  <Route path="services/water-tank-cleaning" element={<WaterTankCleaning />} />
                  <Route path="ro-water-purifier-cleaning" element={<ROPurifierCleaning />} />
                  <Route path="services/ro-water-purifier-cleaning-and-maintenance" element={<ROPurifierCleaning />} />
                  <Route path="bathroom-kitchen-cleaning" element={<BathroomKitchenCleaning />} />
                  <Route path="services/bathroom-and-kitchen-deep-cleaning" element={<BathroomKitchenCleaning />} />
                  <Route path="glass-window-cleaning" element={<GlassWindowCleaning />} />
                  <Route path="services/glass-cleaning" element={<GlassWindowCleaning />} />
                  <Route path="services/:slug" element={<ServiceDetail />} />
                  <Route path="locations" element={<Locations />} />
                  <Route path="locations/:city" element={<Locations />} />
                  <Route path="gallery" element={<Gallery />} />
                  <Route path="contact" element={<Contact />} />
                  <Route path="booking" element={<Booking />} />
                </Route>
                <Route path="admin/login" element={<Login />} />
                <Route path="admin" element={<AdminLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="bookings" element={<Bookings />} />
                  <Route path="inquiries" element={<Inquiries />} />
                  <Route path="services" element={<ServicesAdmin />} />
                  <Route path="services/new" element={<ServiceForm />} />
                  <Route path="services/:id" element={<ServiceForm />} />
                  <Route path="gallery" element={<GalleryAdmin />} />
                  <Route path="content" element={<Content />} />
                  <Route path="testimonials" element={<Testimonials />} />
                  <Route path="faqs" element={<Faqs />} />
                  <Route path="seo" element={<SeoAdmin />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="*" element={<NotFound />} />
                </Route>
                <Route element={<PublicLayout />}>
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </AuthProvider>
          </SiteProvider>
        </ConfirmProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
