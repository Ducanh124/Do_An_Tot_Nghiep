import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation(); // Đưuòng dẫn đg hiện

  useEffect(() => {
    // Mỗi khi đường dẫn (pathname dường dẫn gạch chéo ) thay đổi, lập tức cuộn lên trên cùng
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
