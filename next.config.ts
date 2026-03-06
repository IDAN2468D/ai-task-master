import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* React Compiler disabled - causes useContext errors during prerendering */
  /* Turning off Turbopack for production build stability if needed */
};

export default nextConfig;
