// components/LenisProvider.jsx
"use client";

import { ReactLenis } from "@studio-freight/react-lenis";

const LenisProvider = ({ children }) => {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1, // Lower values create a smoother, heavier feel
        duration: 1.5, // Duration of the scroll animation
        smoothTouch: true, // Enable smooth scrolling on touch devices
      }}
    >
      {children}
    </ReactLenis>
  );
};

export default LenisProvider;
