import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation(); // Lấy đường dẫn hiện tại

  useEffect(() => {
    // Mỗi khi đường dẫn (pathname) thay đổi, lập tức cuộn lên tọa độ (0, 0)
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
