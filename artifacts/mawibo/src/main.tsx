import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { setBaseUrl } from "@workspace/api-client-react";
import { API_BASE_URL } from "@/lib/api-url";

// Configure the generated API client to use the correct base URL.
// VITE_API_URL overrides the default (same-origin) when the API is
// deployed separately from the frontend.
setBaseUrl(API_BASE_URL || null);

createRoot(document.getElementById("root")!).render(<App />);
