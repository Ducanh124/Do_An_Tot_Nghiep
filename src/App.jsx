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

function App() {
  return (
    <BrowserRouter>
      {/* Nơi chứa Navbar (Menu) sau này sẽ đặt ở đây để hiển thị ở mọi trang */}
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

        {/* Trang đặt lịch: Nhận tham số động là id của dịch vụ (:id) */}
        <Route path="/booking/:id" element={<BookingPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
