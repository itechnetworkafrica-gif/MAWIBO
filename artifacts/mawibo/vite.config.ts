import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

const rawPort = process.env.PORT;
// PORT is required for dev server but not for production builds
const port = rawPort ? Number(rawPort) : 3000;

if (rawPort && (Number.isNaN(port) || port <= 0)) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

// BASE_PATH defaults to "/" for Vercel / standalone deployments
const basePath = process.env.BASE_PATH ?? "/";

const isReplit =
  process.env.REPL_ID !== undefined || process.env.REPL_SLUG !== undefined;
const isDev = process.env.NODE_ENV !== "production";

export default defineConfig(async () => {
  const devPlugins = [];

  if (isDev) {
    const { default: runtimeErrorOverlay } = await import(
      "@replit/vite-plugin-runtime-error-modal"
    );
    devPlugins.push(runtimeErrorOverlay());

    if (isReplit) {
      const { cartographer } = await import(
        "@replit/vite-plugin-cartographer"
      );
      const { devBanner } = await import("@replit/vite-plugin-dev-banner");
      devPlugins.push(
        cartographer({ root: path.resolve(import.meta.dirname, "..") }),
        devBanner(),
      );
    }
  }

  return {
    base: basePath,
    plugins: [react(), tailwindcss(), ...devPlugins],
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "src"),
        "@assets": path.resolve(
          import.meta.dirname,
          "..",
          "..",
          "attached_assets",
        ),
      },
      dedupe: ["react", "react-dom"],
    },
    root: path.resolve(import.meta.dirname),
    build: {
      outDir: path.resolve(import.meta.dirname, "dist/public"),
      emptyOutDir: true,
      // Code-split for better caching
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("node_modules")) {
              if (
                id.includes("react/") ||
                id.includes("react-dom/") ||
                id.includes("wouter")
              ) {
                return "react-vendor";
              }
              if (id.includes("@tanstack/react-query")) {
                return "query";
              }
              if (id.includes("framer-motion")) {
                return "motion";
              }
              if (id.includes("recharts") || id.includes("d3-")) {
                return "charts";
              }
              if (id.includes("lucide-react")) {
                return "icons";
              }
              if (id.includes("@radix-ui/")) {
                return "radix";
              }
            }
          },
        },
      },
    },
    server: {
      port,
      strictPort: true,
      host: "0.0.0.0",
      allowedHosts: true,
      fs: {
        strict: true,
      },
    },
    preview: {
      port,
      host: "0.0.0.0",
      allowedHosts: true,
    },
  };
});
