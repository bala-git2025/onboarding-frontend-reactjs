import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";

interface FadeInSlideScaleProps {
  children: React.ReactNode;
  duration?: number;
  offset?: number;
  scaleFrom?: number;
}

const FadeInSlideScale: React.FC<FadeInSlideScaleProps> = ({
  children,
  duration = 600,
  offset = 20,
  scaleFrom = 0.95,
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Box
      sx={{
        opacity: visible ? 1 : 0,
        transform: visible
          ? "translateY(0) scale(1)"
          : `translateY(${offset}px) scale(${scaleFrom})`,
        transition: `opacity ${duration}ms ease-in, transform ${duration}ms ease-out`,
        height: "100%",
      }}
    >
      {children}
    </Box>
  );
};

export default FadeInSlideScale;