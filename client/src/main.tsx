import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { Suspense } from "react";

createRoot(document.getElementById("root")!).render(
  <Suspense fallback={<div className="h-screen w-full flex items-center justify-center">Loading...</div>}>
    <App />
  </Suspense>
);
