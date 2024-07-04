/*import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': process.env,
  },
})*/

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { loadEnv } from "vite";
import EnvironmentPlugin from "vite-plugin-environment";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [
      react(),
      EnvironmentPlugin([
        "REACT_API_URL_BACKEND",
        "VITE_API_KEY",
        "VITE_AUTH_DOMAIN",
        "VITE_PROJECT_ID",
        "VITE_STORAGE_BUCKET",
        "VITE_MESSAGING_SENDER_ID",
        "VITE_APP_ID",
        "VITE_MEASUREMENT_ID",
      ]),
    ],
    define: {
      "process.env": env,
    },
  };
});
