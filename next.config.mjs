/** @type {import('next').NextConfig} */
import withPWAInit from "@ducanh2912/next-pwa";
const nextConfig = {
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
};

const withPWA = withPWAInit({
  dest: "public",
  cacheOnFrontEndNav:true,
  aggressiveFrontEndNavCaching:true,
  reloadOnOnline:true,
  swMinify:true,
  disable:false,
  workboxOptions:{
    disableDevLogs:true
  }
});

export default withPWA({
  nextConfig,
});
