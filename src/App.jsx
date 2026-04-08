// frontend/src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ServiceList from "./components/service/ServiceList";
import BookingPage from "./pages/BookingPage";
import Header from "./components/layout/Header.jsx";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import HeroSlider from "./components/common/HeroSlider";
import FeaturesSection from "./components/common/FeaturesSection";
import Footer from "./components/layout/Footer.jsx";
import Login from "./components/auth/Login.jsx";
import ServiceDirectory from "./pages/ServiceDirectory.jsx";
import ScrollToTop from "./components/common/ScrollToTop.jsx";
import CheckoutBooking from "./pages/CheckoutBooking.jsx";
import ProtectedRoute from "./components/auth/ProtectedRoute.jsx";
import BookingHistory from "./pages/BookingHistory.jsx";
function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Header />
      <Routes>
        {/* Trang chủ: Hiển thị danh sách dịch vụ */}
        <Route
          path="/"
          element={
            <>
              <HeroSlider />
              <FeaturesSection />
              <ServiceList />
            </>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route
          path="/danh-muc"
          element={
            <ProtectedRoute>
              <ServiceDirectory />
            </ProtectedRoute>
          }
        />

        {/* Trang đặt lịch: Nhận tham số động là id của dịch vụ (:id) */}
        <Route
          path="/booking/:id"
          element={
            <ProtectedRoute>
              <BookingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <CheckoutBooking />
            </ProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <BookingHistory />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
