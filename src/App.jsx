// frontend/src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ServiceList from "./components/common/ServiceList";
import BookingPage from "./pages/BookingPage";
import Header from "./components/layout/Header.jsx";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import HeroSlider from "./components/common/HeroSlider";
import FeaturesSection from "./components/common/FeaturesSection";
import Footer from "./components/layout/Footer.jsx";
import Login from "./components/auth/Login.jsx";
import ListCategory from "./pages/ListCategory.jsx";
import ScrollToTop from "./components/common/ScrollToTop.jsx";
import BookingHistory from "./pages/BookingHistory.jsx";
import ProtectedRoute from "./components/auth/ProtectedRoute.jsx";
import ServiceListByCategory from "./pages/ServiceListByCategory.jsx";
import ProfilePage from "./components/auth/ProfilePage.jsx";
import Policy from "./pages/Policy.jsx";
function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Header />

      <Routes>
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
              <ListCategory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dich-vu/:categoryId"
          element={
            <ProtectedRoute>
              <ServiceListByCategory />
            </ProtectedRoute>
          }
        />

        {/* Trang đặt lịch: Nhận tham số động là id của dịch vụ (:id) */}
        <Route
          path="/booking/:serviceId"
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
              <BookingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route path="/policy" element={<Policy />} />
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
