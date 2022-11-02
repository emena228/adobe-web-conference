import { useEffect, useState } from "react";
import { debounce } from "lodash";

const useLayout = () => {
  const [hasMounted, setHasMounted] = useState(false);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 375
  );
  const [windowHeight, setWindowHeight] = useState(
    typeof window !== "undefined" ? window.innerHeight : 635
  );

  const handleResize = debounce(() => {
    setWindowWidth(window.innerWidth);
    setWindowHeight(document.documentElement?.clientHeight || window.innerHeight);
  }, 33);

  useEffect(() => {
    setHasMounted(true);
    setTimeout(handleResize);

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return {
    hasMounted,
    windowWidth,
    windowHeight,
  };
};

export default useLayout;
